import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { trpc } from "../../../_trpc/client";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Wrong email format"),
  password: z.string({
    required_error: "Password is required",
  }),
  confirmPassword: z.string({
    required_error: "Confirm password is required",
  }),
});

export const useViewModel = () => {
  const validate = toFormikValidationSchema(registerSchema);
  const router = useRouter();

  const registerMut = trpc.register.useMutation();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    console.log({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    try {
      await registerMut.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      router.push("/tasks");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    validate,
    onSubmit,
  };
};
