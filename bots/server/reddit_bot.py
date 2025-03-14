import discord
from discord.ext import commands
import openai
import csv
from datetime import datetime
import os
import shutil
import json
import random
import tweepy
import praw
from twython import Twython
from dotenv import load_dotenv
import re
import asyncio
#twitter bot

load_dotenv()

# Replace with your credentials
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
ACCESS_KEY = os.getenv("ACCESS_KEY")
ACCESS_SECRET = os.getenv("ACCESS_SECRET")
BEARER_KEY = os.getenv("BEARER_KEY")

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    username=os.getenv("REDDIT_USERNAME"),
    password=os.getenv("REDDIT_PASSWORD"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)
client = tweepy.Client(bearer_token=BEARER_KEY,
        consumer_key = CONSUMER_KEY, consumer_secret=CONSUMER_SECRET,
        access_token=ACCESS_KEY, access_token_secret=ACCESS_SECRET)

# LLM setup
openai.api_key = os.getenv("OPENAI_API_KEY")
# Bot setup
intents = discord.Intents.default()
intents.messages = True
intents.members = True 
intents.message_content = True  # Needed to read message content
bot = commands.Bot(command_prefix="!", intents=intents)
input_dir="./All_Companies"
max_no_of_backend_function_calls=4
function_names=['get_all_companies_data','post_on_reddit','post_on_twitter']
def load_chatgpt_json(input_string):
    return json.loads(input_string)
    """
    Cleans and extracts valid JSON from a string that may have extraneous text
    before or after the JSON content, including irregular formatting.
    """
    try:
        # Use a regex to find the first valid JSON-like structure
        json_like_match = re.search(r"({.*}|\[.*\])", input_string, re.DOTALL)
        
        if not json_like_match:
            raise ValueError("No valid JSON object found in the input string.")
        
        # Extract the matched JSON-like content
        json_like_string = json_like_match.group(0)
        
        # Replace single quotes with double quotes for JSON compatibility
        cleaned_string = re.sub(r"(?<!\\)'", '"', json_like_string)
        print(cleaned_string)
        # Parse the cleaned string as JSON
        return json.loads(cleaned_string)
    except Exception as e:
        raise ValueError(f"Failed to parse JSON: {e}")
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
def reutrn_all_employess_all_payments(csv_file):
    rows = []
    final_ans={}
    company_id=csv_file.split('.csv')[0]
    with open(input_dir+"/"+company_id+"/"+csv_file, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
    for row in rows:
        final_ans[row[0]]=get_payment_records(str(row[0]),csv_file)
    return str(final_ans)
def get_all_companies_data():
    #Function to fetch all of the data of the companies we are catering to
    final_ans={}
    for company in os.listdir(input_dir):
        if(company=="PayZoll"):
            continue
        final_ans[company]=reutrn_all_employess_all_payments(company+".csv")
    return str(final_ans)
                              
def post_on_reddit(subreddit,title,body):
    # Function used to post on reddit provided with the subreddit that you want to post to, title of the post and the body of the post
    subreddit_name = subreddit  # Replace with your desired subreddit
    title = title
    body = body
    try:
        subreddit =reddit.subreddit(subreddit_name)
        post = subreddit.submit(title, selftext=body)
        print(f"Post created! View it at: {post.url}")
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False    
def post_on_twitter(body):
    try:
        post_result = client.create_tweet(text = body).errors
        return "Posted successfully on twitter"
    except Exception as e:
        error_message = str(e)
        error_code = getattr(e.response, "status_code", "Unknown")  # Extract the HTTP status code
        print(error_code)
        print(type(error_code))
        if(error_code==403):
            return "Not able to post on twitter please change the post as twitter detected it was written by a bot" 
        elif(error_code==429):
            return "Not able to post on twitter as twitter told us too many posts: "+error_message
        else:
            return "Not able to post on twitter as twitter told us : "+error_message 
                       

async def main_function(employee_id,company_id,message):
    if( not os.path.exists(input_dir+"/"+company_id)):
        os.mkdir(input_dir+"/"+company_id)
    messages = []
    if(not os.path.exists(input_dir+"/"+company_id+"/"+employee_id+".json")):
        messages = [ {"role": "system", "content": """Important: The posts should be simple so that they are not blocked by Twitter API
                        You are a Reddit and a Twitter manager chatbot you are in a conversation with a user and the backend, your input will have two things response from the user and from the backend. Sometimes you might need some response from the backend functions to answer properly, wait for the repsonse for that time you set ResponseForTheUser as empty, do not make up information, that will not be tolerated. Once the backend function calls have reported to you the information then you should inform the user, with appropriate messages. Now for the description of the company, the companies name in PayZoll and our basic goal is to improve the payroll management systems that is being used. For this we have propposed the use of cryptocurrencies since it might get difficult for the Web2 users to shift to Web3 we plan to use the current advancements in AI to improve upon it. There are various benefits for using crypto currencies like reduced waiting time, reduced gas costs, secure and anonymous transactions. Our final objective is to come up with a system that is as efficient and simple as doing UPI transactions in India. You are going to help us market this idea. You might also be asked to present an overall sentiment analysis of the comments people have made on our posts. We have many companies in our portfolio and for each company We have a main CSV file that contains the columns: {employee_id,current_status,wallet_address} employee_id: has the  id of the employee which is a unique identifier for each employee,current_status: has the  current status of the employee, whether he is currently working with us or not. Then there are is a CSV file for each employee each CSV has the following columns: {amount,date,type,gas_cost,time_of_transaction}, amount: gives how much amount of money was transfered, date: it gives the date of transaction, type: what was the type of transaction there are three classes: {bonus, regular, overtime}, bonus: means company is happy with the users performance and wanted to awrd him or her, regular means the monthly salary of the employee, overtime means that the employee was paid for his work other than his usual work hours, gas_cost is the amount of gas in dollars was spent to send the cryptocurrency, time_of_transaction how mich time was spent to execute this transaction.When the user asks you to make a post then you display the content to the user, when the user feels it's ok he/she will explicitly ask you to post the same, then depending on the previous conversation you will have to post it on Reddit, Twitter or whatever the user wants, for posting you have to use the functions that have been defined in the following lines. I have defined the following functions to help you process users requests, if the user asks you to post use the appropriate function for example for reddit we have post_on_reddit pass the appropriate arguments it will work similarly for twitter there is post_on_twitter: 
                        [    
def get_all_companies_data():
    #Function to fetch all of the data of the companies we are catering to
    final_ans={}
    for company in os.listdir(input_dir):
        if(company=="PayZoll"):
            continue
        final_ans[company]=reutrn_all_employess_all_payments(company+".csv")
    return str(final_ans)
                              
async def post_on_reddit(subreddit,title,body):
    # Function used to post on reddit provided with the subreddit that you want to post to, title of the post and the body of the post
    subreddit_name = subreddit  # Replace with your desired subreddit
    title = title
    body = body
    try:
        subreddit = await reddit.subreddit(subreddit) 
        post = await subreddit.submit(title, selftext=body)
        print(f"Post created! View it at: {post.url}")
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False    
def post_on_twitter(body):
    #this function is used to post on twitter you have to provide the body a parameter taken that is basically the content of the twitter post
    try:
        api.update_status(body)
        return "Tweet posted successfully!"
    except tweepy.TweepError as e:
        return f"An error occurred: {e}"                      
]
I am also providing with you some exaples of tweets as twitter detects tweets from bots so you need to make them simple but for others you can addemojis and stuff so please be very careful
                      1. Did you know @PayZoll uses AI to automate payroll processing? It's all about accuracy and compliance! #CryptoPayroll #Innovation
2. @PayZoll is setting new standards with blockchain-backed security and smart contracts for payroll. Worth exploring! #Web3
3. Curious about seamless cross-border transactions? @PayZoll offers instant and low-cost solutions. #Blockchain
4. The blend of AI and blockchain in payroll? That’s @PayZoll making things efficient and secure!
5. Ever faced payroll delays? @PayZoll’s automation and smart contracts ensure timeliness. #FutureOfWork
                      
Important!!!! Do not post any where till the user says so this will not be tolerated at all
Your replies should also contain two sections(In the form of Python Dicitionaries):
FunctionCalls: \newline
Name_of_the_function, Be careful write only the function call and nothing else (But you have to provide the parameters without them it will couse errors) as this will be interpreted by a code which will just search for the function name, also provide the parameters for the function , just provide the parameters after commas example Name_of_the_function:"post_on_twitter, Hi this is my first post on twitter".  There can be multiple functions with their parameters so that you can satisfy the user requrement\newline
ResponseForTheUser: \newline
Text_to_show_to_the_user \newline
You will get as input (In the form of Python Dicitionaries):
Response_From_TheFunction_Calls:
Reply_From_The_User: Do not return anything if there is nothing to display or you are waiting for replies from the backend
Only these two FunctionCalls and ResponseForTheUser should be the response do not include anything else!! Remember both input and output should be in the exact JSON format Do not write json or anything in the begining I will be calling json.load directly on whatever you return so be careful and return everything enclosed in double quotation {"Response_From_TheFunction_Calls":"","Reply_From_The_User":""} and {"Name_of_the_function":"","Text_to_show_to_the_user":""}"""} ]
    else:
        with open(input_dir+"/"+company_id+"/"+employee_id+".json", "r") as file:
            messages = json.load(file)
    local_max_count=max_no_of_backend_function_calls
    meassage_content={}
    meassage_content['Response_From_TheFunction_Calls']=""
    meassage_content['Reply_From_The_User']=message.content
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
    chat_gpt_reply_dictionary = load_chatgpt_json(reply)
    if(chat_gpt_reply_dictionary['Name_of_the_function']==""):
        await message.channel.send(chat_gpt_reply_dictionary['Text_to_show_to_the_user'])
        
        with open(input_dir+"/"+company_id+"/"+employee_id+".json", "w") as file:
            json.dump(messages, file, indent=4)
    else:
        function_and_returned_values=""
        function_names=['get_all_companies_data','post_on_reddit','post_on_twitter']
        while local_max_count>0:
            list_of_functions_and_parameters=str(chat_gpt_reply_dictionary['Name_of_the_function']).split(',')
            first_pointer_list=0
            remove_from_the_chat_history_file=False
            while first_pointer_list<len(list_of_functions_and_parameters):
                second_pointer_list=first_pointer_list+1
                while second_pointer_list<len(list_of_functions_and_parameters):
                    if(list_of_functions_and_parameters[second_pointer_list] in function_names):
                        break
                    second_pointer_list+=1
                if(list_of_functions_and_parameters[first_pointer_list]==function_names[0]):
                    if(second_pointer_list-first_pointer_list-1==0):
                        return_value=get_all_companies_data()
                        remove_from_the_chat_history_file=True
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="get_all_companies_data: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[1]):
                    if(second_pointer_list-first_pointer_list-1>=2):
                        return_value= post_on_reddit(list_of_functions_and_parameters[first_pointer_list+1],list_of_functions_and_parameters[first_pointer_list+2],' '.join(list_of_functions_and_parameters[first_pointer_list+3:second_pointer_list]))
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="post_on_reddit: "+str(return_value)
                elif(list_of_functions_and_parameters[first_pointer_list]==function_names[2]):
                    if(second_pointer_list-first_pointer_list-1>=1):
                        return_value= post_on_twitter(' '.join(list_of_functions_and_parameters[first_pointer_list+1:second_pointer_list]))
                    else:
                        return_value="Number of parameters not enough"
                    function_and_returned_values+="post_on_twitter: "+str(return_value)
                first_pointer_list=second_pointer_list
            meassage_content={}
            meassage_content['Response_From_TheFunction_Calls']=function_and_returned_values
            meassage_content['Reply_From_The_User']=""
            meassage_content=json.dumps(meassage_content)
            meassage_content=str(meassage_content)
            print("meassage_content: ",meassage_content)
            messages.append(
                    {"role": "user", "content": meassage_content},
                )
            chat = openai.ChatCompletion.create(
                    model="gpt-4o", messages=messages
                )
            reply = chat.choices[0].message.content
            print(reply)
            print(type(reply))
            chat_gpt_reply_dictionary = load_chatgpt_json(reply)
            messages.append({"role": "assistant", "content": reply})
            if(remove_from_the_chat_history_file):
                messages.pop(-2)
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
bot.run('MTM0ODQ0NTgwNjM3MzM3NjAyMA.G5x2IW.K13fRi_OUsTzCOQ9X8vX6CwKIBd500nkUGF9lI')  # Replace 'YOUR_BOT_TOKEN' with your actual bot token
