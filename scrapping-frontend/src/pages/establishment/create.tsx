import { Create, ListButton, SaveButton, useAutocomplete } from "@refinedev/mui";

import Box from "@mui/material/Box";
import { Button, Step, StepLabel, Stepper, TextField, TextFieldProps, Typography, Checkbox, FormControlLabel } from "@mui/material";

import { useForm } from "@refinedev/react-hook-form";
import { HttpError, useNavigation, useTranslate } from "@refinedev/core";
import { Controller } from "react-hook-form";
import { Grid } from "@mui/material";
import { useState } from "react";

interface EstablishmentProps {
  name: string;
  url: string;
  description: string;
  number_of_reviews: number;
  formatted_address: string;
  lat: string;
  long: string;
  place_id: string;
  plus_code: string;
  rating: number;
  types: any;
  website: string;
  is_establishment_found: boolean;
  postal_code: string;
  address_1: string;
  categories: string;
  about: string;
  search_key: string;
  country: string;
  phone: string;
  town: string;
  area: string;
  establishment_identifier: string;
}

export const EstablishmentCreate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const translate = useTranslate();

  const { push } = useNavigation();
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    formState: { errors },
    trigger,
    control
  } = useForm<EstablishmentProps, HttpError, EstablishmentProps>({
    refineCoreProps: {
      resource: "establishment",
      action: "create",
      onMutationError(error, variables, context, isAutoSave) {
        console.log(error)
      },
      onMutationSuccess(data, variables, context, isAutoSave) {
        setTimeout(() => {
          push("/establishment/list");
        }, 1000)
      },
    }
  });

  const steps = ["Coordonnées", "Détails de l'entreprise", "Informations supplémentaires"];
  const commonTextFieldProps: TextFieldProps = {
    variant: "standard" as "standard",
    margin: "normal",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    className: "custom-input",
  }

  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <TextField
              {...register("name", { required: translate("input.requiredSpecified", { name: translate("pages.establishment.create.fields.name") }), })}
              {...commonTextFieldProps}
              error={!!errors?.name}
              helperText={<>{errors?.name?.message ?? ""}</>}
              type="text"
              label={translate("pages.establishment.create.fields.name")}
              name="name"
            />
            <TextField
              {...register("url", {
                required: translate("input.requiredSpecified", { name: translate("pages.establishment.create.fields.url") }),
                pattern: {
                  value: /^https:\/\/(?:www\.google\.com\/maps\/place\/[a-zA-Z0-9\s%\-]+(?:\/@([0-9\-\.]+,[0-9\-\.]+,([0-9]+)z)?)?(?:\/[^\s?]+)?(?:\?[\w&=%\-]+)?|maps\.google\.com\/\?cid=[0-9]+|maps\.app\.goo\.gl\/[a-zA-Z0-9]+)/,
                  message: translate("input.url"),
                },
              })}
              {...commonTextFieldProps}
              error={!!errors?.url}
              InputProps={{ multiline: true }}
              helperText={<>{errors?.url?.message ?? ""}</>}
              type="text"
              label={translate("pages.establishment.create.fields.url")}
              name="url"
            />
            <TextField
              {...register("description")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.description")}
              name="description"
            />
            <TextField
              {...register("formatted_address")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.formatted_address")}
              name="formatted_address"
            />
            <TextField
              {...register("lat")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.lat")}
              name="lat"
            />
            <TextField
              {...register("long")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.long")}
              name="long"
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              {...register("place_id")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.place_id")}
              name="place_id"
            />
            <TextField
              {...register("types")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.types")}
              name="types"
            />
            <TextField
              {...register("website")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.website")}
              name="website"
            />
            <TextField
              {...register("plus_code")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.plus_code")}
              name="plus_code"
            />
            <TextField
              {...register("postal_code")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.postal_code")}
              name="postal_code"
            />
            <TextField
              {...register("phone")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.phone")}
              name="phone"
            />
            <TextField
              {...register("area")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.area")}
              name="area"
            />
            <TextField
              {...register("town")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.town")}
              name="town"
            />
            <TextField
              {...register("country")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.country")}
              name="country"
            />
            <TextField
              {...register("rating")}
              {...commonTextFieldProps}
              inputProps={{ min: 1, max: 5 }}
              type="number"
              label={translate("pages.establishment.create.fields.rating")}
              name="rating"
            />
            <TextField
              {...register("number_of_reviews")}
              {...commonTextFieldProps}
              inputProps={{ min: 0 }}
              type="number"
              label={translate("pages.establishment.create.fields.number_of_reviews")}
              name="number_of_reviews"
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              {...register("categories")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.categories")}
              name="categories"
            />
            <TextField
              {...register("address_1")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.address_1")}
              name="address_1"
            />
            <TextField
              {...register("about")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.about")}
              name="about"
            />
            <TextField
              {...register("search_key")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.search_key")}
              name="search_key"
            />
            <TextField
              {...register("establishment_identifier")}
              {...commonTextFieldProps}
              type="text"
              label={translate("pages.establishment.create.fields.establishment_identifier")}
              name="establishment_identifier"
            />
            <FormControlLabel
              control={<Checkbox {...register("is_establishment_found")} name="is_establishment_found" />}
              label={<Typography variant="body2">{translate("pages.establishment.create.fields.is_establishment_found")}</Typography>}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const cancel = () => {
    push("/establishment/list");
  }

  return (
    <Create
      isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">{translate("pages.establishment.create.title")}</Typography>),
        sx: { rowGap: "10px", flexWrap: "wrap" }
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton onClick={cancel} children={translate("pages.establishment.create.headerButtons.list")}></ListButton>
          {defaultButtons}
        </>
      )}
      footerButtons={({ defaultButtons }) => (<></>)}
      footerButtonProps={{ style: { padding: 0 } }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          mt: "10px"
        }}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onFinish)}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={2} mb={2}>
          <StepContent />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >{translate("pages.establishment.create.buttons.prev")}</Button>
          {activeStep === steps.length - 1 ? (
            <SaveButton {...saveButtonProps}>{translate("pages.establishment.create.buttons.save")}</SaveButton>
          ) : (
            <Button onClick={handleNext}>{translate("pages.establishment.create.buttons.next")}</Button>
          )}
        </Box>
      </Box>
    </Create>
  );
};