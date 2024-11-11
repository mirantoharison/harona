import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useLogin, useNavigation, useNotification, useTranslation } from "@refinedev/core";
import { MouseEventHandler, useEffect } from "react";
import { LanguageChange } from "../../components/language";
import { usePageTitle } from "../../components/title";

interface userData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { open } = useNotification();
  const { replace } = useNavigation();
  const { mutateAsync: login, isLoading } = useLogin<userData>({
    mutationOptions: {
      onSuccess(data, variables, context) {
        if (data.success && data.token) {
          localStorage.setItem("auth_token", data?.token as string);
          replace("/");
        }
        else {
          open?.({
            key: "account-login-error",
            type: "error",
            message: translate("pages.login.error.credential"),
            description: translate("pages.login.error.title")
          });
        }
      },
      onError(error) {
        open?.({
          type: "error",
          message: `Erreur : ${error?.message}\nDetails : ${error?.stack}` || 'An unexpected error occurred.',
          description: 'Login Failed',
        });
      }
    }
  });
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<userData>();
  const { translate } = useTranslation();

  const onSubmit = async (data: userData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    try {
      // Appel de la logique de connexion après validation
      login({
        email: data.email,
        password: data.password
      })
    } catch (error: any) {
      console.log(error)
    }
  };

  usePageTitle("GMB | Se connecter");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", p: "0 40px" }}>
      <TextField
        label={translate("pages.login.fields.emailLabel")}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        {...register("email", { required: translate("input.email"), pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: translate("input.emailValid") } })}
        error={!!errors.email}
        helperText={errors.email?.message}
        className="custom-input"
      />
      <TextField
        type="password"
        label={translate("pages.login.fields.passwordLabel")}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        {...register("password", { required: translate("input.password") })}
        error={!!errors.password}
        helperText={errors.password?.message}
        className="custom-input"
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? translate("pages.login.buttonLoad") : translate("pages.login.button")}
      </Button>
    </Box>
  );
};

export const LoginPage = () => {
  const { translate } = useTranslation();
  const { replace } = useNavigation();

  const handleRedirectRegister: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    replace("/register");
  };

  return (
    <div style={{ width: "40%", minWidth: "400px", maxWidth: "600px", margin: "0 auto", borderRadius: "10px", padding: "50px 0", display: "flex", flexDirection: "column", rowGap: "10px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4, p: "0 40px" }}>
        <LanguageChange />
      </Box>
      <Typography variant="h3" fontWeight={"bold"} sx={{ mb: "40px", textAlign: "center", p: "0 40px" }}>{translate("pages.login.title")}</Typography>
      <LoginForm />
      <Typography variant="body2" sx={{ textAlign: "center", mt: "20px" }}>{translate("pages.login.forgotPassword")} <a href="#" className="link">{translate("pages.login.resetPassword")}</a></Typography>
      <Typography variant="body2" sx={{ textAlign: "center" }}>{translate("pages.login.noaccount")} <a href="#" onClick={handleRedirectRegister} className="link">{translate("pages.login.sign")}</a></Typography>
    </div>
  );
};
