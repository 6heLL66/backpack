import { Button, Input, Card, CardBody } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AuthService, OpenAPI, UserService } from "../../api";
import { useAuthStore } from "./store";

interface LoginFormData {
  email: string;
  password: string;
}

export const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const { login } = useAuthStore();

  const authMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await AuthService.loginApiAuthLoginPost({ requestBody: data });
  
      return response;
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const response = await authMutation.mutateAsync(data)

    OpenAPI.TOKEN = response.access_token;

    const user = await UserService.userMeApiUsersMeGet();

    login(user, response);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <Card className="w-full max-w-md shadow-2xl border border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <CardBody className="p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Welcome back
            </h1>
            <p className="text-gray-300 text-lg">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <div className="space-y-2">
              <Input
                type="text"
                label="Email"
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base text-white",
                  inputWrapper: "h-14 bg-gray-800/50 border-gray-700 hover:border-indigo-500 focus-within:border-indigo-500 transition-colors duration-200",
                  label: "text-gray-300 font-medium"
                }}
                {...register("email", {
                  required: "Email is required",
                })}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                label="Password"
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base text-white",
                  inputWrapper: "h-14 bg-gray-800/50 border-gray-700 hover:border-indigo-500 focus-within:border-indigo-500 transition-colors duration-200",
                  label: "text-gray-300 font-medium"
                }}
                {...register("password", {
                  required: "Password is required",
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              size="lg"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
