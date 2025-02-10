"use client";

import React, { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

import { Button } from "@/components/Atoms/UI/button";
import { Form } from "@/components/Atoms/UI/form";
import DynamicForm from "@/components/Molecules/CustomForm";

type ForgotPasswordType = {
  label: string;
  name: "emailId";
  value: string;
  required: boolean;
  type: "email";
  description: string;
  placeholder: string;
  id: string;
  className: string;
  disabled?: boolean;
};

type FullContactFormType = (ForgotPasswordType[] | ForgotPasswordType)[];

const clientSchema = z.object({
  emailId: z.string().email({ message: "Invalid email address." }),
});

const INIT_DATA = {
  emailId: "",
};

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [forgotPasswordFields, setForgotPasswordFields] =
    useState<FullContactFormType>([
      {
        label: "Email",
        name: "emailId",
        value: "",
        required: true,
        placeholder: "Enter your registered email",
        description: "We'll use this to get back to you.",
        type: "email",
        id: "1",
        className: "w-full",
        disabled: !!loading,
      },
    ]);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: INIT_DATA,
  });

  const handleSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/password/forgot`, data);
      if (response.data && response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        form.setValue("emailId", "");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: response.data.message,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        text: "Something went wrong",
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <h1 className="font-bold text-2xl">Forgot Password</h1>
          <div className="flex flex-col items-start justify-between p-6 w-[95vw] sm:w-full lg:min-w-[500px] space-y-8 rounded-lg shadow-xl">
            {forgotPasswordFields.map((ele) =>
              Array.isArray(ele) ? (
                ele.map((field) => (
                  <DynamicForm key={field.id} fieldProps={field} form={form} />
                ))
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
    </div>
  );
};

export default ForgotPasswordPage;
