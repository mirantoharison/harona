import { Stack, Box, Grid, Typography, Card, CardContent, SxProps, Theme } from "@mui/material";
import { LinkOutlined, Star } from "@mui/icons-material";
import { useShow, useParsed } from "@refinedev/core";
import { StateCell, Tag } from "../../components";
import {
  DateField,
  MarkdownField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import React from "react";

interface BlogDetailConditionalFieldProps {
  style?: SxProps<Theme>;
  field: {
    label: string;
    value: React.ReactNode; // ReactNode to accommodate both strings and JSX elements
  };
}

const BlogReviewCard = ({ review }) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", placeContent: "space-between" }}>
          <Typography variant="h5" gutterBottom>{review.reviewerName}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: .6 }}>
            <Star sx={{ color: '#FECD00' }} />
            <Typography color="gray" variant="body1">{`${review.reviewerStar} étoile${review.reviewerStar > 1 ? "s" : ""}`}</Typography>
          </Box>
        </Box>
        <Typography variant="h6">{review.reviewDate}</Typography>
        <a href={review.reviewerLink || "#"} target="_blank" style={{ display: "flex", columnGap: "8px" }} rel="noopener noreferrer" className="link">
          <Typography sx={{ mb: 1.5 }}>{review.reviewerLink}</Typography>
          <LinkOutlined />
        </a>
        <Typography variant="body1">{review.reviewNote}</Typography>
      </CardContent>
    </Card>
  );
}

const BlogDetailContitionalField: React.FC<BlogDetailConditionalFieldProps> = ({ style = {}, field }) => {
  if (field.label && field.value) {
    const isJSXElement = React.isValidElement(field.value);
    const isAlphaNumeric = typeof field.value === "string" || typeof field.value === "number";

    return (
      <>
        {
          field.label && field.value ? (
            <Box className="task-details-box" sx={style}>
              <Typography variant="body1" fontWeight={"bold"}>{field.label} :</Typography>
              {isJSXElement ? field.value : isAlphaNumeric ? (<Typography variant="body1">{field.value}</Typography>) : ""}
            </Box >
          ) : ("")
        }
      </>
    );
  }
  return (<></>);
}

export const BlogPostShow = () => {
  const { id } = useParsed();
  const { query } = useShow({ resource: "jobs", id });
  const { data, isLoading, isFetching, isError, refetch } = query;
  const jobData = data?.data?.job;
  const jobResultData = data?.data?.job.returnvalue;
  const companyInfo = jobResultData?.companyInfo;
  const reviewList = jobResultData?.reviews;

  return (
    <Show
      isLoading={isLoading}
      canDelete={true}
      canEdit={jobData?.state !== 'completed'}
      title={
        <Typography variant="h4">
          Détails concernant la tâche {id}
        </Typography>
      }
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            flex={1} className="task-details-section">
            {
              !isLoading ? (
                <Stack rowGap={"10px"}>
                  <Typography variant="h6" style={{ textDecoration: "underline" }}>Informations générales</Typography>
                  <BlogDetailContitionalField field={{ label: "ID de la tâche", value: jobData.id }} />
                  <BlogDetailContitionalField field={{ label: "Nom de la fil d'attente parent", value: jobData.name }} />
                  <BlogDetailContitionalField field={{
                    label: "URL relatif à la tâche",
                    value: (
                      <a href={jobData.data.url || "#"} target="_blank" style={{ display: "flex", columnGap: "8px" }} rel="noopener noreferrer" className="link">
                        <Typography>{jobData.data.url}</Typography>
                        <LinkOutlined />
                      </a>
                    )
                  }} />
                  <BlogDetailContitionalField field={{ label: "Etat", value: (<StateCell row={{ state: jobData.state }} />) }} style={{ alignItems: "center" }} />
                  <BlogDetailContitionalField field={{ label: "Date de création", value: jobData.timestamp }} />
                  <BlogDetailContitionalField field={{ label: "Date de traitement", value: jobData.processedOn }} />
                  <BlogDetailContitionalField field={{ label: "Términé le", value: jobData.finishedOn }} />
                  <BlogDetailContitionalField field={{ label: "Nombre d'avis total disponible", value: jobData.totalReviews }} />
                  <BlogDetailContitionalField field={{ label: "Nombre d'avis récupéré", value: jobData.countReviewsScrapped }} />
                  <BlogDetailContitionalField field={{ label: "Commentaires", value: jobData.comments }} style={{ flexDirection: "column" }} />
                </Stack>
              ) : ("")
            }
          </Box>
          <Box
            flex={1} className="task-details-section">
            {
              !isLoading ? (
                <Stack rowGap={"10px"}>
                  <Typography variant="h6" style={{ textDecoration: "underline" }}>Détails relatifs à la page</Typography>
                  <BlogDetailContitionalField field={{ label: "Nom de la page", value: companyInfo.title }} />
                  <BlogDetailContitionalField field={{ label: "Type d'activité", value: companyInfo.businessType }} />
                  <BlogDetailContitionalField field={{ label: "Adresse", value: companyInfo.address }} />
                  <BlogDetailContitionalField field={{ label: "Plus code", value: companyInfo.plusCode }} />
                  <BlogDetailContitionalField field={{
                    label: "Site web", value: (
                      <a className="link" href={companyInfo.website || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "flex", columnGap: "8px" }}>
                        <Typography>{companyInfo.website}</Typography>
                        <LinkOutlined />
                      </a>
                    )
                  }} />
                  <BlogDetailContitionalField field={{ label: "Téléphone", value: companyInfo.phone }} />
                  <BlogDetailContitionalField
                    field={{
                      label: "Note moyenne des avis",
                      value: (
                        <Tag icon={(<Star sx={{ color: '#FECD00', marginRight: .3, scale: .8 }} />)} text={`${companyInfo.averageReview} étoile${companyInfo.averageReview > 1 ? "s" : ""}`} />
                      )
                    }}
                    style={{ alignItems: "center" }} />
                </Stack>
              ) : ("")
            }
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            flex={1} className="task-details-section"
            sx={{
              width: "100%", // Always full width for the third box
            }}>

            {
              !isLoading ? (
                <Stack rowGap={"10px"}>
                  <Typography variant="h6" style={{ textDecoration: "underline" }}>Avis récoltés</Typography>
                  {
                    reviewList.map((review) => (
                      <BlogReviewCard review={review} />
                    ))
                  }
                </Stack>
              ) : ("")
            }
          </Box>
        </Grid>
      </Grid>
    </Show >
  );
};
