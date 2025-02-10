"use client";

import React, { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/Atoms/UI/button";
import { Form } from "@/components/Atoms/UI/form";
import DynamicForm from "@/components/Molecules/CustomForm";
import { Show } from "@/utils/show";

type ForgotPasswordType = {
  label: string;
  name: "password" | "confirmPassword";
  value: string;
  required: boolean;
  type: "password";
  description: string;
  placeholder: string;
  id: string;
  className: string;
  disabled?: boolean;
};

type FullContactFormType = (ForgotPasswordType[] | ForgotPasswordType)[];

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

const clientSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(16, { message: "Password must not exceed 16 characters." })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const INIT_DATA = {
  password: "",
  confirmPassword: "",
};

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: INIT_DATA,
  });

  const [resetPasswordFields, setResetPasswordFields] =
    useState<FullContactFormType>([
      [
        {
          label: "Password",
          name: "password",
          value: "",
          required: true,
          placeholder: "Enter your new password",
          description: "Your new password",
          type: "password",
          id: "11",
          className: "w-full",
          disabled: !!loading,
        },
      ],
      {
        label: "Confirm Password",
        name: "confirmPassword",
        value: "",
        required: true,
        placeholder: "Confirm your password",
        description: "Confirm your new given password",
        type: "password",
        id: "12",
        className: "w-full",
        disabled: !!loading,
      },
    ]);

  const handleSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/password/reset`, {
        password: data.password,
        token,
      });
      if (response.data && response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        setLoading(false);
        router.push("/");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        text: "Somethiong went wrong",
        timer: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <Show>
        <Show.When isTrue={!!token}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <h1 className="font-bold text-2xl">Set new password</h1>
              <div className="flex flex-col items-start justify-between p-6 w-[95vw] sm:w-full lg:min-w-[500px] space-y-8 rounded-lg shadow-xl">
                {resetPasswordFields.map((ele, index) =>
                  Array.isArray(ele) ? (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full gap-3"
                    >
                      {ele.map((field) => (
                        <DynamicForm
                          key={field.id}
                          fieldProps={field}
                          form={form}
                        />
                      ))}
                    </div>
                  ) : (
                    <DynamicForm key={ele.id} fieldProps={ele} form={form} />
                  )
                )}
                <Button
                  type="submit"
                  className="bg-primary hover:bg-secondary delay-150 ease-in-out w-full text-white px-4 py-2 rounded"
                  disabled={!!loading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </Show.When>
        <Show.Else>
          <p>Required parameters are missing or link has been expired</p>
        </Show.Else>
      </Show>
    </div>
  );
};

export default ResetPasswordPage;
