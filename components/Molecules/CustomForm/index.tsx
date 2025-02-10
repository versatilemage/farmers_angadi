import { useState } from "react";
import { Input } from "@/components/Atoms/UI/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Atoms/UI/form";
import { Textarea } from "@/components/Atoms/UI/textarea";
import { UseFormReturn } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type ContactType<T> = {
  label: string;
  name: T;
  value: string;
  required: boolean;
  type: "text" | "email" | "textarea" | "number" | "password";
  description: string;
  placeholder: string;
  id: string;
  className: string;
  disabled?: boolean;
};

const inputComponentMap = {
  text: Input,
  email: Input,
  number: Input,
  textarea: Textarea,
};

type DynamicFormProps<T> = {
  fieldProps: ContactType<T>;
  form: UseFormReturn<any>;
};

const DynamicForm = <T extends keyof any>({ fieldProps, form }: DynamicFormProps<T>) => {
  const { type, name, label, placeholder, className, disabled, description, id } = fieldProps;

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const InputComponent = inputComponentMap[type] || Input;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <FormField
      key={id}
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormMessage className="text-red-400" />
          <FormControl>
            {type === "password" ? (
              <div className="relative">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder={placeholder}
                  className={`${className} pr-10`}
                  disabled={disabled}
                  {...field}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 focus:outline-none"
                >
                  {isPasswordVisible ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            ) : (
              <InputComponent
                type={type !== "textarea" ? type : undefined}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                {...field}
              />
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
        </FormItem>
      )}
    />
  );
};

export default DynamicForm;
