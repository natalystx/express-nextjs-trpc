import { toFormikValidationSchema } from "zod-formik-adapter";
import { trpc } from "../../../_trpc/client";
import { z } from "zod";
import Token from "../../../utils/Token";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Wrong email format"),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const useViewModel = () => {
  const validate = toFormikValidationSchema(loginSchema);
  const router = useRouter();

  const loginMut = trpc.login.useMutation();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginMut.mutateAsync({
        email: values.email,
        password: values.password,
      });
      Token.set({
        accessToken: res.accessToken,
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
