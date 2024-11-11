import React, { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useTranslation } from "@refinedev/core";
import { DeleteButton, Edit, EditButton, List, ListButton, RefreshButton, SaveButton, ShowButton } from "@refinedev/mui";
import { Box, Typography, Button, Grid, TextField, SxProps, Theme } from "@mui/material";
import { Tag } from "../../components";
import { IntegrationInstructions } from "@mui/icons-material";

interface SelectorCardProps {
  name: string;
  selector: any;
  value?: Function;
  register?: Function;
  registerProps?: {
    name: string;
    required?: string | null;
    errors: any;
  };
}

interface SelectorResponseProps {
  body: {
    misc: {
      reviewButton: string;
      reviewSort: string;
      reviewSortByNewest: string;
      reviewLoading: string;
      reviewBlock: string;
    },
    company: {
      title: string;
      businessType: string;
      description: string;
      address: string;
      website: string;
      openHours: string;
      phone: string;
      plusCode: string;
      reviewCount: string;
      averageReview: string;
      ratings: string;
    },
    review: {
      reviewId: string;
      reviewerLink: string;
      reviewerName: string;
      reviewerStar: string;
      reviewDateText: string;
      reviewerReviewsCount: string;
      reviewerVisitedDate: string;
      reviewNote: string;
      seeMore: string;
    }
  }
}

interface SelectorProps {
  reviewButton: string;
  reviewSort: string;
  reviewSortByNewest: string;
  reviewLoading: string;
  reviewBlock: string;
  companyInfo: {
    title: string;
    businessType: string;
    description: string;
    address: string;
    website: string;
    openHours: string;
    phone: string;
    plusCode: string;
    reviewCount: string;
    averageReview: string;
    ratings: string;
  },
  review: {
    reviewId: string;
    reviewerLink: string;
    reviewerName: string;
    reviewerStar: string;
    reviewDateText: string;
    reviewerReviewsCount: string;
    reviewerVisitedDate: string;
    reviewNote: string;
    seeMore: string;
  }
}

export const SelectorCard: React.FC<SelectorCardProps> = React.memo(({ name, selector, value, register, registerProps }) => {
  useEffect(() => {
    if (value) {
      console.log(selector)
      value(registerProps?.name, selector ?? "");
    }
  }, [selector, registerProps?.name, value]);

  return (
    <Box>
      <Grid container sx={{ alignItems: "flex-start" }}>
        <Grid item md={12} lg={3} sx={{pt: "4px"}}>{selector.displayName || name}</Grid>
        <Grid item md={12} lg={2} sx={{pt: "4px"}}>{name}</Grid>
        <Grid item md={12} lg={7}>
          <TextField
            {...register?.(registerProps?.name, {
              required: registerProps?.required,
            })}
            error={!!registerProps?.errors?.[name]}
            helperText={<>{registerProps?.errors?.[name]?.message}</>}
            variant="standard"
            className="custom-input"
            sx={{ width: "100%" }}
            inputProps={{
              spellCheck: "false"
            }}
            InputProps={{
              style: {
                color: "#1976D2"
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

export const SelectorConfigList = () => {
  const [misc, setMisc] = useState({});
  const [company, setCompany] = useState({});
  const [review, setReview] = useState({});
  const { translate } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { query, formLoading },
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<SelectorResponseProps, HttpError, SelectorProps>({
    refineCoreProps: {
      resource: "selectors",
      action: "edit",
      id: 1
    }
  });

  useEffect(() => {
    const data = query?.data?.data?.body;
    if (data) {
      if (data.misc) setMisc(data.misc);
      if (data.company) setCompany(data.company);
      if (data.review) setReview(data.review);
    }
  }, [query?.data]);

  return (
    <Edit
      isLoading={formLoading}
      goBack={null}
      headerProps={{
        title: (
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "24px" }}>
            <IntegrationInstructions />
            <Typography variant="h4">Liste des sélécteurs pour GMB</Typography>
          </Box>
        ),
        style: { rowGap: "10px", padding: "20px", borderBottom: "1px solid #f5f5f5" },
      }}
      headerButtons={({ refreshButtonProps }) => (
        <>
          <RefreshButton {...refreshButtonProps} children={translate("pages.selectors.edit.headerButtons.refresh")}></RefreshButton>
          <SaveButton {...saveButtonProps} variant="text"></SaveButton>
        </>
      )}
      footerButtons={() => null}
      footerButtonProps={{ sx: { p: 0 } }}
      saveButtonProps={{
        ...saveButtonProps,
        children: translate("pages.selectors.edit.footerButtons.save"),
        variant: "contained",
        color: "primary",
      }}
      contentProps={{ sx: { p: 0 } }}
    >
      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column", rowGap: 2 }}>
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "4px", borderBottom: "1px solid #30303050", boxShadow: "0 0 1px #30303080", rowGap: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f5f5f5" }}>Général</Typography>
          {misc ? (
            Object.entries(misc).map(([key, selector]) => (
              <SelectorCard key={key} name={key} selector={selector} register={register} value={setValue} registerProps={{ name: key, required: "Le champs est obligatoire", errors }} />
            ))
          ) : null}
        </Box>
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "4px", borderBottom: "1px solid #30303050", boxShadow: "0 0 1px #30303080", rowGap: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f5f5f5" }}>Entreprise</Typography>
          {company ? (
            Object.entries(company).map(([key, selector]) => (
              <SelectorCard key={key} name={key} selector={selector} register={register} value={setValue} registerProps={{ name: `companyInfo.${key}`, required: "Le champs est obligatoire", errors }} />
            ))
          ) : null}
        </Box>
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "4px", borderBottom: "1px solid #30303050", boxShadow: "0 0 1px #30303080", rowGap: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f5f5f5" }}>Avis</Typography>
          {review ? (
            Object.entries(review).map(([key, selector]) => (
              <SelectorCard key={key} name={key} selector={selector} register={register} value={setValue} registerProps={{ name: `review.${key}`, required: "Le champs est obligatoire", errors }} />
            ))
          ) : null}
        </Box>
      </Box>
      <Box></Box>
      <Box></Box>
    </Edit>
  );
};
