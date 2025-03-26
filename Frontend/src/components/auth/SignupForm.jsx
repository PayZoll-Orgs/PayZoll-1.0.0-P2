import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import FormInput from "./FormInput";
import PasswordStrength from "./PasswordStrength";
import { deployContract } from "../../blockchain/scripts/Token";
import { ethers } from "ethers";
import { scaling } from "../../utils/blockchainUtil";
import { useWeb3 } from "../../context/useWeb3";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendDomain } from "../../constant/domain";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password", "");
  const { provider, signer } = useWeb3();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Generate random 3-letter token name and symbol
    const generateRandomLetters = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };

    const randomTokenSymbol = generateRandomLetters(3);
    const randomTokenName = randomTokenSymbol;

    // const address = await deployContract(
    //   signer,
    //   randomTokenName,
    //   randomTokenSymbol,
    //   ethers.parseUnits("1000", 18)
    // );
    // console.log("Contract Address: ", address);
    const address = "0x" + "0".repeat(40);

    const registerData = {
      email: data.email,
      password: data.confirmPassword,
      name: data.companyName,
      contractAddress: address,
      tokenName: randomTokenName,
      tokenSymbol: randomTokenSymbol,
      tokenCount: "1000",
    };

    try {
      const response = await axios.post(
        `${backendDomain}/register`,
        registerData
      );
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response ? error.response.data : error.message
      );
    }
    navigate("/auth?mode=login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Company Name"
        type="text"
        placeholder="Enter company name"
        icon={<Building2 className="w-5 h-5" />}
        error={errors.companyName}
        {...register("companyName", {
          required: "Company name is required",
          minLength: {
            value: 2,
            message: "Company name must be at least 2 characters",
          },
        })}
      />

      <FormInput
        label="Business Email"
        type="email"
        placeholder="Enter company email"
        icon={<Mail className="w-5 h-5" />}
        error={errors.email}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
      />

      <div className="space-y-2">
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          icon={<Lock className="w-5 h-5" />}
          error={errors.password}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        <PasswordStrength password={password} />
      </div>

      <FormInput
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        placeholder="Confirm your password"
        icon={<Lock className="w-5 h-5" />}
        error={errors.confirmPassword}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
      />

      {/* <FormInput
        label="ESOP/RSU Token Name"
        type="text"
        placeholder="Enter token name"
        error={errors.tokenName}
        {...register("tokenName", {
          required: "Token name is required",
          minLength: {
            value: 2,
            message: "Token name must be at least 2 characters",
          },
        })}
      /> */}

      {/* <FormInput
        label="ESOP/RSU Token Symbol"
        type="text"
        placeholder="Enter token symbol"
        error={errors.tokenSymbol}
        {...register("tokenSymbol", {
          required: "Token symbol is required",
          maxLength: {
            value: 5,
            message: "Token symbol must not exceed 5 characters",
          },
        })}
      /> */}

      {/* <FormInput
        label="Initial Supply"
        type="number"
        placeholder="Enter initial supply"
        error={errors.initialSupply}
        {...register("initialSupply", {
          required: "Initial supply is required",
          min: {
            value: 1,
            message: "Initial supply must be at least 1",
          },
        })}
      /> */}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl
                 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center"
      >
        Create Employer Account
      </button>

      <p className="text-sm text-gray-400 text-center">
        By signing up, you agree to our{" "}
        <a href="#" className="text-indigo-400 hover:text-indigo-300">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-indigo-400 hover:text-indigo-300">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}

export default SignupForm;
