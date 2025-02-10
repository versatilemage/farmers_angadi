"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

import { useAuth } from "@/components/Wrapper/universalState";
import { Button } from "@/components/Atoms/UI/button";
import { Form } from "@/components/Atoms/UI/form";
import DynamicForm from "@/components/Molecules/CustomForm";

import { IUsersDocument } from "@/models/user";

type ContactFormType = {
  name: string;
  emailId: string;
  query: string;
};

type ContactType = {
  label: string;
  name: "name" | "emailId" | "query";
  value: string;
  required: boolean;
  type: "text" | "email" | "textarea";
  description: string;
  placeholder: string;
  id: string;
  className: string;
  disabled?: boolean;
};

type FullContactFormType = (ContactType[] | ContactType)[];

const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  emailId: z.string().email({ message: "Invalid email address." }),
  query: z
    .string()
    .min(10, { message: "Your query must be at least 10 characters." })
    .max(255, { message: "Your query must not be greater than 255 characters." }),
});

const INIT_DATA = {
  name: "",
  emailId: "",
  query: "",
};

const ContactUsPage = () => {
  const { selectedUserData } = useAuth() as { selectedUserData: IUsersDocument };

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: INIT_DATA,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [contactArr, setContactArr] = useState<FullContactFormType>([
    [
      {
        label: "Full name",
        name: "name",
        value: "",
        required: true,
        placeholder: "Enter your name",
        description: "Your full name to address users query properly.",
        type: "text",
        id: "11",
        className: "w-full",
        disabled: !!selectedUserData || !!loading,
      },
    ],
    [
      {
        label: "Email",
        name: "emailId",
        value: "",
        required: true,
        placeholder: "Enter your email",
        description: "We'll use this to get back to you.",
        type: "email",
        id: "21",
        className: "w-full",
        disabled: !!selectedUserData || !!loading,
      },
    ],
    {
      label: "Message",
      name: "query",
      value: "",
      required: true,
      placeholder: "Enter your message here...",
      description: "Provide a detailed query for better assistance.",
      type: "textarea",
      id: "3",
      className: "w-full max-h-[150px]",
      disabled: !!loading,
    },
  ]);

  useEffect(() => {
    if (selectedUserData) {
      form.setValue("emailId", selectedUserData.email);
      form.setValue("name", selectedUserData.username);
    }
  }, [selectedUserData]);

  const handleSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/contact`, data);
      if (response.data && response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your query has been submitted successfully",
        });
        if (!selectedUserData) {
          Object.keys(INIT_DATA).forEach((key: keyof ContactFormType) => {
            form.setValue(key, "");
          });
        } else {
          form.setValue("query", "");
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        text: "Error submitting your query.",
        timer: 3000,
      });
    }
  };

  return (
    <div className="w-full h-full min-h-screen">
      <div className="flex flex-col-reverse sm:flex-row items-start justify-start gap-6 py-6 max-w-[1280px] m-auto px-4">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-col items-start gap-3">
            <h1 className="font-bold text-3xl">Get in touch</h1>
            <p className="max-w-[450px] text-sm font-light">
              We'd love to hear from you! Whether you have questions, need
              support, or want to learn more about our services, our team is here to help.
            </p>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 p-4 w-full h-full bg-primary/95 hover:bg-secondary text-tertiary duration-100 ease-out rounded-lg shadow-lg">
            <h1>Address</h1>
            <p className="text-sm font-light">No 4, West Street, Kallakudi, Ariyalur - 621707</p>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 p-4 w-full h-full bg-primary/95 hover:bg-secondary text-tertiary duration-100 ease-out rounded-lg shadow-lg">
            <h1>Contact</h1>
            <p className="text-sm font-light">
              <strong>Email:</strong>{" "}
              <a href="mailto:farmersangadi@gmail.com">farmersangadi@gmail.com</a>
            </p>
            <p className="text-sm font-light">
              <strong>Phone:</strong> <a href="tel:+918838521634">+91 88385 21634</a>
            </p>
          </div>
        </div>
        <div className="flex items-end justify-items-end w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 sm:ml-auto"
            >
              <h1 className="font-bold text-2xl">Contact Us</h1>
              <div className="flex flex-col items-start justify-between p-6 w-[95vw] sm:w-full lg:min-w-[500px] space-y-8 rounded-lg shadow-xl">
                {contactArr.map((ele) =>
                  Array.isArray(ele)
                    ? ele.map((field) => (
                        <DynamicForm key={field.id} fieldProps={field} form={form} />
                      ))
                    : <DynamicForm key={ele.id} fieldProps={ele} form={form} />
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
      </div>
    </div>
  );
};

export default ContactUsPage;
