import React, { useEffect, useRef, useState, useCallback } from "react";
import { DeleteButton, EditButton, List, ShowButton, ListButton, SaveButton } from "@refinedev/mui";
import { Box, Typography, Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Create } from "@refinedev/mui";
import { type HttpError, useNavigation, useTranslation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

interface JobProps {
  name: string;
  url: string;
  comments?: string;
}

export const JobAdd = () => {
  const { push } = useNavigation();
  const { translate } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger
  } = useForm<JobProps, HttpError, JobProps>({
    refineCoreProps: {
      resource: "jobs",
      action: "create",
      onMutationError(error, variables, context, isAutoSave) {
        console.log(error)
      },
      onMutationSuccess(data, variables, context, isAutoSave) {
        setTimeout(() => {
          push("/jobs/list");
        }, 3000)
      },
    },
  });

  const cancel = () => {
    push("/jobs/list");
  }

  return (
    <Create
      isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">{translate("pages.jobs.create.title")}</Typography>)
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton onClick={cancel} children={translate("pages.jobs.create.headerButtons.list")}></ListButton>
          {defaultButtons}
        </>
      )}
      saveButtonProps={{
        ...saveButtonProps,
        children: null,
        variant: "contained",
        color: "primary",
      }}
      footerButtons={({ saveButtonProps }) => (
        <>
          <SaveButton variant="contained" {...saveButtonProps}>{translate("pages.jobs.create.footerButtons.save")}</SaveButton>
          <Button color="error" variant="contained" onClick={cancel}>{translate("pages.jobs.create.footerButtons.cancel")}</Button>
        </>
      )}
    >
      <Grid
        container
        spacing={2}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onFinish)}
      >
        <Grid item sm={12} md={6}>
          <TextField
            {...register("name", {
              required: translate("input.required"),
            })}
            variant="standard"
            error={!!errors?.name}
            helperText={<>{errors?.name?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.nameInputLabel")}
            name="name"
            className="custom-input"
          />
          <TextField
            {...register("url", { required: true })}
            variant="standard"
            error={!!errors?.url}
            helperText={<>{errors?.url?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.urlInputLabel")}
            name="url"
            className="custom-input"
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            {...register("comments")}
            variant="standard"
            error={!!errors?.comments}
            helperText={<>{errors?.comments?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.commentInputLabel")}
            name="comments"
            className="custom-input"
            multiline={true}
            placeholder={translate("pages.jobs.create.commentInputPlaceholder")}
          />
        </Grid>
      </Grid>
    </Create >
  )
}