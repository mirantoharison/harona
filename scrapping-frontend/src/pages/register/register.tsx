import { TextField, Button, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigation, useNotification, useTranslation } from "@refinedev/core";
import { authProvider } from "../../providers/mockAuthProvider";
import { MouseEventHandler, useState } from "react";
import { LanguageChange } from "../../components/language";

interface userData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const RegisterForm = () => {
  const { translate } = useTranslation();
  const { open, close } = useNotification();
  const { push } = useNavigation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<userData>();

  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data: userData) => {
    setIsLoading(true);
    try {
      if (authProvider) {
        await (authProvider as any).register(data);
        open?.({
          key: "account-create",
          type: "success",
          message: "Succès",
          description: "Votre compte a été créé avec succès",
        });
        setTimeout(() => {
          push("/login");
        }, 3000);
      }
    } catch (error: any) {
      open?.({
        key: "account-create-error",
        type: "error",
        message: "Erreur lors de la création du compte",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <TextField
        label={translate("pages.register.fields.emailLabel")}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        {...register("email", { required: translate("input.email"), pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: translate("input.emailValid") } })}
        error={!!errors.email}
        helperText={errors.email?.message}
        className="custom-input"
      />
      <TextField
        type="password"
        label={translate("pages.register.fields.passwordLabel")}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        {...register("password", { required: translate("input.password") })}
        error={!!errors.password}
        helperText={errors.password?.message}
        className="custom-input"
      />
      <TextField
        type="password"
        label={translate("pages.register.fields.passwordConfirmLabel")}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        {...register("passwordConfirmation", {
          required: translate("input.passwordConfirm"),
          validate: value => value === password || translate("input.passwordDifferent"),
        })}
        error={!!errors.passwordConfirmation}
        helperText={errors.passwordConfirmation?.message}
        className="custom-input"
      />
      <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? translate("pages.register.buttonLoad") : translate("pages.register.button")}
      </Button>
    </Box>
  );
};

export const RegisterPage = () => {
  const { push } = useNavigation();
  const { translate } = useTranslation();

  const handleRedirectLogin: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    push("/login");
  };

  return (
    <div style={{ width: "40%", minWidth: "400px", maxWidth: "600px", margin: "0 auto", borderRadius: "10px", padding: "50px 0" }}>
      <Box sx={{display: "flex", justifyContent: "flex-end", mb: 4}}>
        <LanguageChange />
      </Box>
      <Typography variant="h3" fontWeight={"bold"} sx={{ mb: "40px", textAlign: "center" }}>{translate("pages.register.title")}</Typography>
      <RegisterForm />
      <Typography variant="body2" sx={{ textAlign: "center", mt: "20px" }}>{translate("pages.register.registered")} <a href="#" onClick={handleRedirectLogin} className="link">{translate("pages.register.connect")}</a></Typography>
    </div>
  );
};
