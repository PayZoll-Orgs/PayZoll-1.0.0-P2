import discord
from discord.ext import commands
import openai
import csv
from datetime import datetime
from dotenv import load_dotenv
import os
import shutil
import json
import random

load_dotenv()

# LLM setup
openai.api_key= os.getenv("OPENAI_API_KEY")
# Bot setup
intents = discord.Intents.default()
intents.messages = True
intents.members = True 
intents.message_content = True  # Needed to read message content
bot = commands.Bot(command_prefix="!", intents=intents)
input_dir="./All_Companies"
max_no_of_backend_function_calls=4
function_names=['add_employee','update_employee_status','get_employee_status','add_payment_record','get_payment_records','is_regular_salary_due','go_through_all_employes_to_check_is_salary_due','reutrn_all_employess_all_payments','make_payment_to_the_employee','make_block_payment_regular']

def clean_chatgpt_json(input_string):
    # Use a regex to find the first valid JSON-like structure
    json_like_match = re.search(r"({.*}|\[.*\])", input_string, re.DOTALL)
    
    if not json_like_match:
        raise ValueError("No valid JSON object found in the input string.")
    
    # Extract the matched JSON-like content
    json_like_string = json_like_match.group(0)
    return json_like_string

def add_employee(employee_id, current_status,csv_file):
    #Add a new employee to the main CSV file.
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([employee_id, current_status])
    return True
    

def update_employee_status(employee_id, new_status,csv_file):
    #Update the status of an employee in the main CSV file.
    rows = []
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    for row in rows:
        if row[0] == employee_id:
            row[1] = new_status
    os.remove(input_dir+"/"+company_id+"/"+csv_file)
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="w", newline="") as file:
        file.truncate(0)  # Ensure the file is completely cleared
        writer = csv.writer(file)
        writer.writerows(rows)  # Write all rows back into the file
    return True
def get_employee_status(employee_id,csv_file):
    #Retrieve the status of an employee.
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        for row in reader:
            if row[0] == employee_id:
                return row[1]
    return None
def convert_to_standard_date(date_str):
    # List of possible date formats
    date_formats = [
        "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%Y/%m/%d",
        "%d/%m/%Y", "%d.%m.%Y", "%Y.%m.%d"
    ]
    for fmt in date_formats:
        try:
            # Parse the date and convert to desired format
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    raise ValueError(f"Date format for '{date_str}' not recognized")
def add_payment_record( amount, date, type_,employee_id,csv_file):
    #sendether
    #Add a payment record for an employee.
    company_id=csv_file.split('.csv')[0]
    date=convert_to_standard_date(date)
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    with open(employee_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([amount, date, type_,str(random.uniform(1.8, 7.2)),str(random.uniform(1, 5))])
    return True

def get_payment_records(employee_id,csv_file):
    #Retrieve payment records for an employee.
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    try:
        with open(employee_file, mode="r") as file:
            reader = csv.reader(file)
            return list(reader)
    except FileNotFoundError:
        return None
def is_regular_salary_due( employee_id,csv_file):
    # Get all payment records for the employee
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    records = get_payment_records( employee_id,csv_file)
    print(employee_id)
    # Filter the records to get only regular payments
    regular_payments = [record for record in records if record[2] == 'regular']
    
    if not regular_payments:
        return False
    
    # Sort the regular payments by date in descending order to get the most recent one
    regular_payments.sort(key=lambda x: datetime.strptime(x[1], '%Y-%m-%d'), reverse=True)
    
    # Get the last regular payment date (most recent payment)
    last_payment_date = regular_payments[0][1]
    
    # Convert string date to datetime object for comparison
    last_payment_date = datetime.strptime(last_payment_date, '%Y-%m-%d')
    
    # Get the current date
    current_date = datetime.now()
    
    # Check if the payment is overdue (for example, checking monthly cycle)
    if (current_date.month != last_payment_date.month) or (current_date.year != last_payment_date.year):
        return True
    
    return False
def go_through_all_employes_to_check_is_salary_due(csv_file):
    rows = []
    final_ans=""
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    rows=rows[1:]
    #print(rows)
    for row in rows:
        ans=is_regular_salary_due(str(row[0]),csv_file)
        final_ans+="Employee ID: "+str(row[0])+" Salary Due : "+ str(ans)
    return final_ans
def reutrn_all_employess_all_payments(csv_file):
    rows = []
    final_ans={}
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    rows=rows[1:]
    for row in rows:
        final_ans[row[0]]=get_payment_records(str(row[0]),csv_file)
    return str(final_ans)
def make_payment_to_the_employee(amount, date, type_,employee_id,csv_file):
    if(is_regular_salary_due(employee_id,csv_file)):
        #Call the function for making payment on chain
        add_payment_record( amount, date, type_,employee_id,csv_file)
        return True
    else:
        return "Salary already paid cannot be paid again"
def calculate_regular_salary(employee_id,csv_file):
    # Get all payment records for the employee
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    records = get_payment_records( employee_id,csv_file)
    
    # Filter the records to get only regular payments
    regular_payments = [record for record in records if record[2] == 'regular']
    
    if not regular_payments:
        return False
    
    # Sort the regular payments by date in descending order to get the most recent one
    regular_payments.sort(key=lambda x: datetime.strptime(x[1], '%Y-%m-%d'), reverse=True)
    
    # Get the last regular payment amoutn
    last_payment_amount = regular_payments[0][0]
    return last_payment_amount
def make_block_payment_regular(csv_file):
    rows = []
    final_ans=""
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    rows=rows[1:]
    #print(rows)
    success=True
    for row in rows:
        ans=is_regular_salary_due(str(row[0]),csv_file)
        if(ans):
            amount=calculate_regular_salary(str(row[0]),csv_file)
            if(make_payment_to_the_employee(amount,datetime.today().strftime('%Y-%m-%d'),'regular',str(row[0]),csv_file)):
                pass
            else:
                success=False
    #wallet address sonic conversion 0.1 to 1
    
    return success
async def main_function(employee_id,company_id,message):
    if( not os.path.exists(input_dir+"/"+company_id)):
        os.mkdir(input_dir+"/"+company_id)
    messages = []
    if(not os.path.exists(input_dir+"/"+company_id+"/"+employee_id+".json")):
        messages = [ {"role": "system", "content": """You are a payroll manager chatbot you are in a conversation with a user and the backend, your reponse will have two things response from the user and  from the backend. Sometimes you might need some response from the backend functions to answer properly, wait for the repsonse for that time you set ResponseForTheUser as empty, do not make up information, that will not be tolerated. Once the backend function calls have reported to you the information then you should inform the user, with appropriate messages. There are two kinds of users one is the Pay_Roll_Manager and other one is a normal employee. A employee can only query about his salary details and nothing else, he cannot update anything not even about his own salaries etc, We have a main CSV file that contains the columns: {employee_id,current_status,wallet_address} employee_id: has the  id of the employee which is a unique identifier for each employee,current_status: has the  current status of the employee, whether he is currently working with us or not, wallet_address is the wallet address for the crypto currency. Then there are is a CSV file for each employee each CSV has the following columns: {amount,date,type,gas_cost,time_of_transaction}, amount: gives how much amount of money was transfered, date: it gives the date of transaction, type: what was the type of transaction there are three classes: {bonus, regular, overtime}, bonus: means company is happy with the users performance and wanted to awrd him or her, regular means the monthly salary of the employee, overtime means that the employee was paid for his work other than his usual work hours, gas_cost is the amount of gas in crypto-currency was spent to send the cryptocurrency, time_of_transaction how mich time was spent to execute this transaction. I have defined the following functions to manipulate these csv files for both the employee and the pay_roll_manager, 
                        [                   
def add_employee(employee_id, current_status,csv_file):
    #Add a new employee to the main CSV file.
    with open(input_dir+"/"+csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([employee_id, current_status])
    return True
    

def update_employee_status(employee_id, new_status,csv_file):
    #Update the status of an employee in the main CSV file.
    rows = []
    with open(input_dir+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    for row in rows:
        if row[0] == employee_id:
            row[1] = new_status
    with open(csv_file, mode="w", newline="") as file:
        file.truncate(0)  # Ensure the file is completely cleared
        writer = csv.writer(file)
        writer.writerows(rows)  # Write all rows back into the file
    return True
def get_employee_status(employee_id,csv_file):
    #Retrieve the status of an employee.
    with open(input_dir+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        for row in reader:
            if row[0] == employee_id:
                return row[1]
    return None
def add_payment_record( amount, date, type_,employee_id,csv_file):
    #Add a payment record for an employee.
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    with open(employee_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([amount, date, type_,str(random.uniform(1.8, 7.2)),str(random.uniform(1, 5))])
    return True

def get_payment_records(employee_id,csv_file):
    #Retrieve payment records for an employee.
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    try:
        with open(employee_file, mode="r") as file:
            reader = csv.reader(file)
            return list(reader)
    except FileNotFoundError:
        return None
def is_regular_salary_due( employee_id,csv_file):
    # Get all payment records for the employee
    company_id=csv_file.split('.csv')[0]
    employee_file = input_dir+"/"+company_id+"/"+str(employee_id)+".csv"
    records = get_payment_records( employee_id,csv_file)
    
    # Filter the records to get only regular payments
    regular_payments = [record for record in records if record[2] == 'regular']
    
    if not regular_payments:
        return False
    
    # Sort the regular payments by date in descending order to get the most recent one
    regular_payments.sort(key=lambda x: datetime.strptime(x[1], '%Y-%m-%d'), reverse=True)
    
    # Get the last regular payment date (most recent payment)
    last_payment_date = regular_payments[0][1]
    
    # Convert string date to datetime object for comparison
    last_payment_date = datetime.strptime(last_payment_date, '%Y-%m-%d')
    
    # Get the current date
    current_date = datetime.now()
    
    # Check if the payment is overdue (for example, checking monthly cycle)
    if (current_date.month != last_payment_date.month) or (current_date.year != last_payment_date.year):
        return True
    
    return False
def go_through_all_employes_to_check_is_salary_due(csv_file):
    rows = []
    final_ans=""
    with open(input_dir+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    for row in rows:
        ans=is_regular_salary_due(str(row[0]),csv_file)
        final_ans+="Employee ID: "+str(row[0])+" Salary Due : "+ str(ans)
    return ans
def reutrn_all_employess_all_payments(csv_file):
    rows = []
    final_ans={}
    with open(input_dir+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    for row in rows:
        final_ans[row]=get_payment_records(str(row[0]),csv_file)
    return str(final_ans)
def make_payment_to_the_employee(amount, date, type_,employee_id,csv_file):
    if(is_regular_salary_due(employee_id,csv_file)):
        #Call the function for making payment on chain
        add_payment_record( amount, date, type_,employee_id,csv_file)
        return True
    else:
        return "Salary already paid cannot be paid again"

def make_block_payment_regular(csv_file):
    #Function to make payment to the employees it will go through all of the employees automatically and pay whose salaries are due You need to call it once to make payment to all of the employees in one go
    rows = []
    final_ans=""
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    rows=rows[1:]
    #print(rows)
    success=True
    for row in rows:
        ans=is_regular_salary_due(str(row[0]),csv_file)
        if(ans):
            amount=calculate_regular_salary(str(row[0]),csv_file)
            if(make_payment_to_the_employee(amount,datetime.today().strftime('%Y-%m-%d'),'regular',str(row[0]),csv_file)):
                pass
            else:
                success=False
    return success                            
                              
]
    
Your replies should also contain two sections(In the form of Python Dicitionaries):
FunctionCalls: \newline
Name_of_the_function, Be careful write only the function call and nothing else as this will be interpreted by a code which will just search for the function name, also provide the parameters for the function no need to provide the csv file, just provide the parameters after space.  There can be multiple functions with their parameters so that you can satisfy the user requrement\newline
ResponseForTheUser: \newline
Text_to_show_to_the_user \newline
You will get as input (In the form of Python Dicitionaries):
Response_From_TheFunction_Calls:
Reply_From_The_User: Do not return anything if there is nothing to display or you are waiting for replies from the backend
Only these two FunctionCalls and ResponseForTheUser should be the response do not include anything else!! Remember both input and output should be in the exact JSON format Do not write json or anything in the begining I will be calling json.load directly on whatever you return so be careful and return everything enclosed in double quotation {"Response_From_TheFunction_Calls":"","Reply_From_The_User":""} and {"Name_of_the_function":"","Text_to_show_to_the_user":""}"""} ]
    else:
        with open(input_dir+"/"+company_id+"/"+employee_id+".json", "r") as file:
            messages = json.load(file)
    mutual_guilds = message.author.mutual_guilds
    member = mutual_guilds[0].get_member(message.author.id)
    if member:
        roles = [role.name for role in member.roles if role.name != "@everyone"]
    name_at_the_begining_of_every_message="Normal_Employee"
    if('Pay_Roll_Manager' in roles):
        name_at_the_begining_of_every_message="Pay_Roll_Manager"
    local_max_count=max_no_of_backend_function_calls
    meassage_content={}
    meassage_content['Response_From_TheFunction_Calls']=""
    meassage_content['Reply_From_The_User']=name_at_the_begining_of_every_message+": "+message.content
    meassage_content=json.dumps(meassage_content)
    meassage_content=str(meassage_content) 
    messages.append(
            {"role": "user", "content": meassage_content},
        )
    chat = openai.ChatCompletion.create(
            model="gpt-4o", messages=messages
        )
    reply = chat.choices[0].message.content
    print(reply)
    print(type(reply))
    messages.append({"role": "assistant", "content": reply})
    chat_gpt_reply_dictionary = json.loads(reply)
    if(chat_gpt_reply_dictionary['Name_of_the_function']==""):
        await message.channel.send(chat_gpt_reply_dictionary['Text_to_show_to_the_user'])
        
        with open(input_dir+"/"+company_id+"/"+employee_id+".json", "w") as file:
            json.dump(messages, file, indent=4)
    else:
        function_and_returned_values=""
        function_names=['add_employee','update_employee_status','get_employee_status','add_payment_record','get_payment_records','is_regular_salary_due','go_through_all_employes_to_check_is_salary_due','reutrn_all_employess_all_payments','make_payment_to_the_employee','make_block_payment_regular']
        while local_max_count>0:
            list_of_functions_and_parameters=str(chat_gpt_reply_dictionary['Name_of_the_function']).split(' ')
            first_pointer_list=0
            remove_from_the_chat_history_file=False
            while first_pointer_list<len(list_of_functions_and_parameters):
                second_pointer_list=first_pointer_list+1
                while second_pointer_list<len(list_of_functions_and_parameters):
                    if(list_of_functions_and_parameters[second_pointer_list] in function_names):
                        break
                    second_pointer_list+=1
                if(list_of_functions_and_parameters[first_pointer_list]==function_names[0]):
                    if(second_pointer_list-first_pointer_list-1==2):
                        return_value=add_employee(list_of_functions_and_parameters[first_pointer_list+1],list_of_functions_and_parameters[first_pointer_list+2],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="add_employee: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[1]):
                    if(second_pointer_list-first_pointer_list-1==2):
                        return_value=update_employee_status(list_of_functions_and_parameters[first_pointer_list+1],list_of_functions_and_parameters[first_pointer_list+2],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="update_employee_status: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[2]):
                    if(second_pointer_list-first_pointer_list-1==1):
                        return_value=get_employee_status(list_of_functions_and_parameters[first_pointer_list+1],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="get_employee_status: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[3]):
                    if(second_pointer_list-first_pointer_list-1==4):
                        return_value=add_payment_record(list_of_functions_and_parameters[first_pointer_list+1],list_of_functions_and_parameters[first_pointer_list+2],list_of_functions_and_parameters[first_pointer_list+3],list_of_functions_and_parameters[first_pointer_list+4],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="add_payment_record: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[4]):
                    if(second_pointer_list-first_pointer_list-1==1):
                        return_value=get_payment_records(list_of_functions_and_parameters[first_pointer_list+1],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="get_payment_records: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[5]):
                    if(second_pointer_list-first_pointer_list-1==1):
                        return_value=is_regular_salary_due(list_of_functions_and_parameters[first_pointer_list+1],company_id+'.csv')
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="is_regular_salary_due: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[6]):
                    if(second_pointer_list-first_pointer_list-1==0):
                        return_value=go_through_all_employes_to_check_is_salary_due(company_id+'.csv')
                        remove_from_the_chat_history_file=True
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="go_through_all_employes_to_check_is_salary_due: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[7]):
                    if(second_pointer_list-first_pointer_list-1==0):
                        return_value=reutrn_all_employess_all_payments(company_id+'.csv')
                        remove_from_the_chat_history_file=True
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="reutrn_all_employess_all_payments: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[8]):
                    if(second_pointer_list-first_pointer_list-1==4):
                        return_value=make_payment_to_the_employee(list_of_functions_and_parameters[first_pointer_list+1],list_of_functions_and_parameters[first_pointer_list+2],list_of_functions_and_parameters[first_pointer_list+3],list_of_functions_and_parameters[first_pointer_list+4],company_id+'.csv')
                        remove_from_the_chat_history_file=False
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="reutrn_all_employess_all_payments: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[9]):
                    if(second_pointer_list-first_pointer_list-1==0):
                        return_value=make_block_payment_regular(company_id+'.csv')
                        remove_from_the_chat_history_file=False
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="reutrn_all_employess_all_payments: "+str(return_value)
                
                first_pointer_list=second_pointer_list
            meassage_content={}
            meassage_content['Response_From_TheFunction_Calls']=function_and_returned_values
            meassage_content['Reply_From_The_User']=""
            meassage_content=json.dumps(meassage_content)
            meassage_content=str(meassage_content)
            messages.append(
                    {"role": "user", "content": meassage_content},
                )
            chat = openai.ChatCompletion.create(
                    model="gpt-4o", messages=messages
                )
            reply = chat.choices[0].message.content
            print(reply)
            print(type(reply))
            chat_gpt_reply_dictionary = json.loads(reply)
            messages.append({"role": "assistant", "content": reply})
            if(remove_from_the_chat_history_file):
                messages.pop(-1)
                messages.pop(-1)
            if(chat_gpt_reply_dictionary['Name_of_the_function']==""):
                await message.channel.send(chat_gpt_reply_dictionary['Text_to_show_to_the_user'])
                with open(input_dir+"/"+company_id+"/"+employee_id+".json", "w") as file:
                    json.dump(messages, file, indent=4)
                break
            if(chat_gpt_reply_dictionary['Text_to_show_to_the_user']!=""):
                await message.channel.send(chat_gpt_reply_dictionary['Text_to_show_to_the_user'])
            local_max_count-=1
            if(local_max_count==0):
                await message.channel.send("Sorry, "+ message.author.name+"I was not able to find a solution for the provided query this bug has been reported and will be taken into account. Thank you and have a great day!!")



        
@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')

@bot.event
async def on_message(message):
    # Ignore messages from the bot itself
    if message.author.bot:
        return

    # Check if the user is in the special users list
    """
    if message.author.id in special_users:
        await message.author.send(f"Hi {message.author.name}, this is your private interaction!")
        if message.attachments:
            for attachment in message.attachments:
                # Print details about the attachment
                print(f"Attachment received: {attachment.filename} (URL: {attachment.url})")
                
                # Save the attachment locally
                file_path = f"./downloads/{attachment.filename}"
                await attachment.save(file_path)
                await message.channel.send(f"Attachment {attachment.filename} has been saved!")
    """
    if bot.user in message.mentions:
        print(f"Message from {message.author.name}: {message.content}")
        mutual_guilds = message.author.mutual_guilds
        if(len(mutual_guilds)>0):
            company_id=str(mutual_guilds[0])
            employee_id=str(message.author.name)
            await main_function(employee_id,company_id,message)
        else:
            await message.channel.send("Hi "+ message.author.name+"I was not able to find any common channel between you and me can you please contact your Payroll Manager. Thank you and have a great day!!")

    # Process commands if any
    await bot.process_commands(message)

@bot.command()
async def hello(ctx):
    """A simple command for testing."""
    await ctx.send(f"Hello, {ctx.author.name}!")

# Run the bot
bot.run(os.getenv('DISCORD_BOT_TOKEN'))  
