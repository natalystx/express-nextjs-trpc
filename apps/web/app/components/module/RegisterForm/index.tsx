"use client";
import { Formik } from "formik";
import Link from "next/link";
import React from "react";
import Input from "../../common/Input";
import { useViewModel } from "./viewmodel";

const RegisterForm = () => {
  const { validate, onSubmit } = useViewModel();
  return (
    <Formik
      validationSchema={validate}
      onSubmit={onSubmit}
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-[512px] flex flex-col gap-y-5 w-full"
        >
          <Input
            name="name"
            label="Name"
            type="text"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={!!formik.touched.email && !!formik.errors.email}
            hint={formik.errors.name}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={!!formik.touched.email && !!formik.errors.email}
            hint={formik.errors.email}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            hasError={!!formik.touched.password && !!formik.errors.password}
            onBlur={formik.handleBlur}
            hint={formik.errors.password}
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            hasError={!!formik.touched.password && !!formik.errors.password}
            onBlur={formik.handleBlur}
            hint={formik.errors.confirmPassword}
          />
          <div className="pt-12 space-y-4">
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
            <Link href="/" className="block">
              <button type="button" className="btn btn-info w-full">
                Back to Login
              </button>
            </Link>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
