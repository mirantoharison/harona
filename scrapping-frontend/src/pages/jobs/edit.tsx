import { useEffect, useState } from "react";
import { useParsed } from "@refinedev/core";
import { DeleteButton, Edit, ListButton, RefreshButton, SaveButton } from "@refinedev/mui";
import { Typography, Button, Grid, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useNavigation, useTranslation } from "@refinedev/core";

interface JobProps {
  name: string;
  data: { url: string };
  comments?: string;
  timestamp: string;
  processedOn?: string;
}

interface JobDetailsProps {
  job: JobProps;
}

export const JobEdit = () => {
  const [data, setData] = useState<null | JobDetailsProps>(null);
  const { translate } = useTranslation();
  const { push } = useNavigation();
  const { id } = useParsed();

  const {
    refineCore: { query, formLoading, onFinish },
    handleSubmit,
    register,
    formState: { errors },
    setValue,
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
        }, 3000)
      },
    },
  });

  const cancel = () => {
    push("/jobs/list");
  }

  useEffect(() => {
    const task = query?.data?.data;
    if (task) {
      const formFields = ["data", "name", "comments"];
      formFields.forEach((field) => {
        const typedKey = field as keyof JobProps;
        setValue(typedKey, task.job[typedKey]);
      });
      setData(task);
    }
  }, [query, setValue]);

  return (
    <Edit
      isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">{translate("pages.jobs.edit.title", { id })}</Typography>)
      }}
      headerButtons={({ listButtonProps, refreshButtonProps }) => (
        <>
          <ListButton {...listButtonProps}>{translate("pages.jobs.edit.headerButtons.list")}</ListButton>
          <RefreshButton {...refreshButtonProps} onClick={() => query?.refetch()}>{translate("pages.jobs.edit.headerButtons.refresh")}</RefreshButton>
          <DeleteButton recordItemId={id}>{translate("pages.jobs.edit.headerButtons.delete")}</DeleteButton>
        </>
      )}
      footerButtons={({ saveButtonProps }) => (
        <>
          <SaveButton {...saveButtonProps} children={translate("pages.jobs.edit.footerButtons.save")} variant="contained" color="primary"></SaveButton>
          <Button color="error" variant="contained" onClick={cancel}>{translate("pages.jobs.edit.footerButtons.cancel")}</Button>
        </>
      )
      }
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
            {...register("data.url", { required: true })}
            variant="standard"
            error={!!errors?.data?.url}
            helperText={<>{errors?.data?.url?.message ?? ""}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.urlInputLabel")}
            name="url"
            className="custom-input"
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.createdOn")}
            name="timestamp"
            className="custom-input"
            InputProps={{ readOnly: true }}
            value={data?.job?.timestamp ?? ""}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.jobs.create.processedOn")}
            name="processedOn"
            className="custom-input"
            InputProps={{ readOnly: true }}
            value={data?.job?.processedOn ?? ""}
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
    </Edit >
  )
}