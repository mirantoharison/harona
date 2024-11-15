import { useEffect, useState } from "react";
import { useCustom, useDelete, useParsed } from "@refinedev/core";
import { DeleteButton, Edit, ListButton, RefreshButton, SaveButton } from "@refinedev/mui";
import { Typography, Button, Grid, TextField, Box, TextFieldProps } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useNavigation, useTranslation } from "@refinedev/core";
import { usePageTitle } from "../../components/title";

import { JobDetailsProps, JobProps } from "../../interfaces/jobs";
import { dataProvider } from "../../providers/mockDataProvider";

export const JobEdit = () => {
  const [data, setData] = useState<null | JobDetailsProps>(null);
  const [shouldRetry, setShouldRetry] = useState(false);
  const [retried, setRetried] = useState(false);

  const { translate } = useTranslation();
  const { push } = useNavigation();
  const { id } = useParsed();

  const {
    refineCore: { query, formLoading, onFinish },
    handleSubmit,
    register,
    saveButtonProps,
    formState: { errors },
    setValue
  } = useForm<JobDetailsProps, HttpError, JobProps>({
    refineCoreProps: {
      resource: "jobs",
      action: "edit",
      id: id,
      onMutationError(error) {
        console.error("An error occurred:", error);
      },
      onMutationSuccess() {
        setTimeout(() => {
          push("/jobs/list");
        }, 1000);
      },
    },
  });

  const { mutate: deleteJob, isSuccess } = useDelete();

  const { data: retryData, isLoading: retryIsLoading, isFetching: retryIsFetching, isSuccess: retryIsSuccess } = useCustom({
    url: `${dataProvider.getApiUrl()}/jobs/retry`,
    method: "get",
    config: {
      query: { id }
    },
    queryOptions: {
      enabled: shouldRetry,
    },
  });

  const commonTextFieldProps: TextFieldProps = {
    variant: "standard",
    margin: "normal",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    className: "custom-input",
  };

  const validationMessages = {
    required: translate("input.required"),
    url: translate("input.url"),
  };


  const deleteItem = (id: number) => {
    deleteJob({
      resource: "jobs",
      id: id,
    });
  };

  const cancel = () => {
    push("/jobs/list");
  }

  const handleRetry = () => {
    setShouldRetry(true);
  }

  useEffect(() => {
    const task = query?.data?.data;
    if (task) {
      if (!data && JSON.stringify(task) !== JSON.stringify(data)) {
        setData(task);
      }
      setValue("name", task.job.data.name);
      setValue("url", task.job.data.url);
    }
  }, [query?.data, setValue]);

  useEffect(() => {
    if (isSuccess) {
      push("/jobs/list");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (retryData?.data?.restart) {
      setRetried(true);
    }
  }, [retryData]);

  usePageTitle(`GMB | Modification de la tâche ${id}`);

  return (
    <Edit
      isLoading={formLoading}
      wrapperProps={{
        sx: {
          '.MuiCardHeader-action': { width: "100%" }
        }
      }}
      headerProps={{
        title: (<Typography variant="h4">{translate("pages.jobs.edit.title", { id })}</Typography>),
        sx: { rowGap: "10px", flexWrap: "wrap" }
      }}
      headerButtons={({ listButtonProps, refreshButtonProps }) => (
        <Box sx={{ display: "flex", width: "100%", flexWrap: "wrap", rowGap: "10px", columnGap: "10px" }}>
          {(!retried && (data?.job.state === "failed")) && (<Button onClick={handleRetry} disabled={retryIsFetching}>Réessayer</Button>)}
          <ListButton {...listButtonProps}>{translate("pages.jobs.edit.headerButtons.list")}</ListButton>
          <RefreshButton {...refreshButtonProps} onClick={() => query?.refetch()}>{translate("pages.jobs.edit.headerButtons.refresh")}</RefreshButton>
          <DeleteButton recordItemId={id} resource={"jobs"} onClick={() => deleteItem(id as number)}>{translate("pages.jobs.edit.headerButtons.delete")}</DeleteButton>
        </Box>
      )}
      footerButtons={() => (
        <>
          <SaveButton {...saveButtonProps} resource={"jobs"} children={translate("pages.jobs.edit.footerButtons.save")} variant="contained" color="primary"></SaveButton>
          <Button color="error" variant="contained" onClick={cancel}>{translate("pages.jobs.edit.footerButtons.cancel")}</Button>
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
        <Grid item sm={12} md={6} sx={{ width: "100%" }}>
          <TextField
            {...register("name", { required: validationMessages.required, })}
            {...commonTextFieldProps}
            error={!!errors?.name}
            helperText={<>{errors?.name?.message}</>}
            type="text"
            label={translate("pages.jobs.create.nameInputLabel")}
            name="name"
          />
          <TextField
            {...register("url", {
              required: true,
              pattern: {
                value: /^https?:\/\/(www\.)?(google\.(com|[a-z]{2})(\.[a-z]{2})?\/maps|maps\.app\.goo\.gl)\/[^\s]+$/,
                message: validationMessages.url,
              },
            })}
            {...commonTextFieldProps}
            error={!!errors?.url}
            helperText={<>{errors?.url?.message ?? ""}</>}
            type="text"
            label={translate("pages.jobs.create.urlInputLabel")}
            name="url"
          />
          <TextField
            {...commonTextFieldProps}
            type="text"
            label={translate("pages.jobs.create.createdOn")}
            name="timestamp"
            InputProps={{ readOnly: true }}
            value={data?.job?.timestamp ?? ""}
          />
          <TextField
            {...commonTextFieldProps}
            type="text"
            label={translate("pages.jobs.create.processedOn")}
            name="processedOn"
            InputProps={{ readOnly: true }}
            value={data?.job?.processedOn ?? ""}
          />
        </Grid>
        <Grid item sm={12} md={6} sx={{ width: "100%" }}>
          <TextField
            {...register("comments")}
            {...commonTextFieldProps}
            error={!!errors?.comments}
            helperText={<>{errors?.comments?.message}</>}
            type="text"
            label={translate("pages.jobs.create.commentInputLabel")}
            name="comments"
            multiline={true}
            placeholder={translate("pages.jobs.create.commentInputPlaceholder")}
          />
        </Grid>
      </Grid>
    </Edit >
  )
}