"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ShowPassword from "@/components/auth/show-password";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { AiFillGoogleSquare } from "react-icons/ai";
import { Dictionary } from "@/app/lang/dictionaries";
import { useState, useTransition } from "react";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import { register } from "@/app/(auth)/actions/register";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import Link from "next/link";
import urls from "@/lib/data/url";

interface RegisterFormProps {
  dict: Dictionary;
}

export default function RegisterForm({ dict }: RegisterFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-center cursor-pointer">
          <div
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-x-2 cursor-pointer px-4 py-2 bg-card hover:bg-muted rounded-lg"
          >
            Google
            <AiFillGoogleSquare size={34} />
          </div>
        </div>
        <div className="w-full flex items-center">
          <div className="w-1/2 h-px bg-white"></div>
          <p className="px-8 flex justify-center items-center">
            {dict.pronouns.or}
          </p>
          <div className="w-1/2 h-px bg-white"></div>
        </div>
      </div>
      <p className="text-sm mx-auto text-center text-muted-foreground first-letter:uppercase">
        {dict.auth.enter_email_register}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center items-center space-y-4"
        >
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dict.form.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={dict.form.name}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dict.form.email}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={dict.form.email}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dict.form.password}</FormLabel>
                <FormControl>
                  <ShowPassword
                    isPending={isPending}
                    password={field.value}
                    setPassword={field.onChange}
                    dict={dict}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            aria-label={dict.auth.register}
            size="lg"
          >
            {dict.auth.register}
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground first-letter:uppercase">
        {dict.auth.agree}{" "}
        <Link
          href={urls.legal}
          className="underline underline-offset-4 hover:text-secondary"
        >
          {dict.policy.terms_of_service}
        </Link>{" "}
        {dict.pronouns.and}{" "}
        <Link
          href={urls.privacy}
          className="underline underline-offset-4 hover:text-secondary"
        >
          {dict.policy.privacy_policy}
        </Link>
        .
      </p>
    </>
  );
}
