import { Tabs, Tab, Stack, Box, Grid, Select, MenuItem, Typography, Card, CardContent, SxProps, Theme, CircularProgress, Pagination, Button, SelectChangeEvent } from "@mui/material";
import { LinkOutlined, Star, DataObject, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft, PlayArrow } from "@mui/icons-material";
import { useShow, useParsed, useBreadcrumb, useList } from "@refinedev/core";
import { StateCell, Tag } from "../../components";
import {
  Show,
  ListButton,
  EditButton,
  DeleteButton,
  ExportButton,
} from "@refinedev/mui";
import React, { useState, useRef, useCallback, useEffect } from "react";

interface BlogDetailConditionalFieldProps {
  style?: SxProps<Theme>;
  field: {
    label: string;
    value: React.ReactNode; // ReactNode to accommodate both strings and JSX elements
  };
}

interface BlogReviewProps {
  id: number;
  reviewerName: string;
  reviewerStar: number;
  reviewNote: string;
  reviewDate: string;
  reviewerLink: string;
}

interface BlogReviewCardProps {
  style?: SxProps<Theme>;
  review: BlogReviewProps;
}

const BlogReviewCard: React.FC<BlogReviewCardProps> = ({ review, style }) => {
  const [fullNote, setFullNote] = useState(false);
  const showFullNote = () => {
    setFullNote(!fullNote);
  }

  return (
    <Card sx={style}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mt: .4 }} className={`star-container star-${review.reviewerStar}`}>
              <Star sx={{ scale: .7 }} />
              <Typography>{review.reviewerStar}</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 0 }}>{review.reviewerName}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">#{review.id}</Typography>
          </Box>
        </Box>
        <Typography variant="body2">a publié le {review.reviewDate}</Typography>
        {
          review.reviewNote ?
            (
              <Box sx={{ mt: 2.5, pt: 2.5, borderTop: "1px solid #f5f5f5" }}>
                {
                  fullNote ? review.reviewNote : review.reviewNote.length >= 100 ? `${review.reviewNote.slice(0, 100)}...` : review.reviewNote
                }
              </Box>
            ) :
            (<Box sx={{ mt: 2.5, pt: 2.5, borderTop: "1px solid #f5f5f5" }}>
              (Aucune note laissée par l'utilisateur)
            </Box>)
        }
        {
          review.reviewNote.length > 200 ? (
            <a
              data-href={review.reviewerLink || "#"}
              target="_blank"
              style={{ display: "flex", columnGap: "3px", alignItems: "center", marginTop: 15, cursor: "pointer" }}
              rel="noopener noreferrer"
              className="link"
              onClick={showFullNote}
              title="Cliquez ici pour afficher l'avis dans un nouvel onglet">
              {
                fullNote ?
                  (<Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="body1" sx={{ fontSize: ".9rem" }}>Masquer une partie de l'avis</Typography><KeyboardDoubleArrowLeft sx={{ scale: .8 }} /></Box>) :
                  (<Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="body1" sx={{ fontSize: ".9rem" }}>Voir l'intégralité de l'avis</Typography><KeyboardDoubleArrowRight sx={{ scale: .8 }} /></Box>)
              }
            </a>
          ) : null
        }
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
              {isJSXElement ? field.value : isAlphaNumeric ? field.value : ""}
            </Box >
          ) : ("")
        }
      </>
    );
  }
  return (<></>);
}

export const BlogPostShow = () => {
  // State to keep track of the selected tab
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { id } = useParsed();
  const { query } = useShow({ resource: "jobs", id });
  const { data, isLoading, isFetching, isError, refetch } = query;
  const jobData = data?.data?.job;
  const jobResultData = data?.data?.job.returnvalue;
  const companyInfo = jobResultData?.companyInfo;

  const { data: reviewData, isLoading: reviewLoading, isError: reviewError, isFetching: reviewFetching, refetch: refetchReview } = useList({
    resource: "reviews",
    pagination: {
      current: page,
      pageSize: pageSize,
    },
    filters: [
      {
        field: "jobId",
        operator: "eq",
        value: id,
      }
    ]
  });

  const maxReviewRatingCount = Math.max(...Object.values(companyInfo?.ratings ?? {}) as number[]);

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value;
    setPage(1);
    setPageSize(Number(newPageSize));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(Number(value));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(Number(newValue));
  };

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
      headerProps={{
        style: {
          display: "flex",
          rowGap: 10,
          paddingTop: 0,
          paddingBottom: 0
        }
      }}
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
      }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps} title="Revenir vers la liste des tâches">Liste des tâches</ListButton>
          )}
          <ExportButton>Exporter</ExportButton>
          {editButtonProps && (
            <EditButton {...editButtonProps} title="Modifier">Modifier</EditButton>
          )}
          <Button sx={{ display: "flex", gap: .8, alignItems: "center" }}><PlayArrow />Lancer</Button>
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} title="Supprimer">Supprimer</DeleteButton>
          )}
        </>
      )}
      footerButtonProps={{
        style: {
          padding: 0,
          margin: 0
        },
      }}
      contentProps={{
        sx: {
          padding: "0",
          marginTop: "30px"
        },
      }}
    >

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="basic tabs example"
        style={{
          margin: "auto -16px",
          paddingTop: "0",
          paddingBottom: "0",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: "1px solid #f5f5f5"
        }}
      >
        <Tab label="Informations générales" />
        <Tab label="Détails concernant la page" />
        <Tab label="Avis récoltés" />
      </Tabs>

      {activeTab === 0 && (
        <Box
          flex={1} className="task-details-section">
          {
            !isLoading ? (
              <Stack rowGap={"10px"}>
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
              </Stack>) : ("")
          }
        </Box>
      )}

      {activeTab === 1 && (
        <Box
          flex={1} className="task-details-section">
          {
            !isLoading && companyInfo !== undefined ? (
              <Grid container sx={{ alignItems: "flex-start" }}>
                <Grid item sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }} md={8} lg={4}>
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
                </Grid>
                <Grid sx={{
                  display: "flex",
                  columnGap: "45px",
                  alignItems: "center"
                }} md={4} lg={8}>
                  <Box sx={{
                    textAlign: "center"
                  }}>
                    <Typography variant="h1" fontWeight={"bold"}>{companyInfo.averageReview}</Typography>
                    <Typography variant="body2">(sur les {companyInfo.reviewCount} avis)</Typography>
                  </Box>
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "10px",
                    width: "250px",
                  }}>
                    {
                      Object.entries(companyInfo.ratings).map(([key, rate]) => {
                        const ratingKey = key.toString().replace(/[^0-9]/g, "")
                        return (
                          <div
                            key={key}
                            className="review-star-box"
                            style={{ width: `${(rate as number / maxReviewRatingCount) * 100}%` }}
                            title={`${rate ?? 0} avis pour ${ratingKey} étoile${Number(ratingKey) > 1 ? "s" : ""}`}
                          />
                        )
                      })
                    }
                  </Box>
                </Grid>
              </Grid>
            ) :
              isLoading ? ("en cours de chargement") :
                (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "50px 0", maxWidth: "400px", margin: "0 auto" }}>
                    <Box sx={{ height: "fit-content", padding: "20px" }}><DataObject sx={{ scale: 3 }} /></Box>
                    <Typography variant="h5" sx={{ mb: "10px" }}>Aucun élément à afficher</Typography>
                    <Typography variant="body1" sx={{ textAlign: "center" }}>Nous n'avons trouvé aucun élément à afficher concernant cette section.</Typography>
                  </Box>
                )
          }
        </Box>
      )
      }

      {
        activeTab === 2 && (
          <Box
            flex={1}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
            {
              reviewData && reviewData.data && reviewData.data.length > 0 ? (
                <>
                  <Box sx={{
                    display: "flex",
                    placeContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #f5f5f5",
                    padding: "5px",
                  }}>
                    <Pagination
                      count={Math.ceil((reviewData?.total || 0) / pageSize)}
                      page={Number(reviewData.page)}
                      onChange={handlePageChange}
                    />
                    <Typography variant="body2">Eléments {`${(reviewData?.page - 1) * pageSize + 1}-${Math.min(reviewData?.page * pageSize, reviewData?.total || 0)}`} de {reviewData?.total ?? 0}</Typography>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <Typography variant="body2">Afficher les avis par :</Typography>
                      <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        sx={{
                          '.MuiOutlinedInput-notchedOutline': { border: "none" }, // No border
                          '.MuiSelect-select': {
                            padding: '10px 20px', // Adjust padding inside the select box
                            color: '#333',        // Text color
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#7b1fa2',         // Custom color for the dropdown icon
                          },
                        }}
                      >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
                    {!reviewFetching ? (
                      <Grid container spacing={2}>
                        {
                          reviewData?.data?.map((review, index) => {
                            const reviewWithIndex = { ...review, id: index + (reviewData?.page - 1) * pageSize + 1 } as { id: number } & BlogReviewProps;

                            return (
                              <Grid item sm={12} md={6} lg={4} xl={3} key={reviewWithIndex.id}>
                                <BlogReviewCard review={reviewWithIndex} />
                              </Grid>
                            );
                          })
                        }
                      </Grid>
                    ) :
                      (
                        <Box sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1
                        }}>
                          <CircularProgress />
                          <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>Chargement de la liste des avis ...</Typography>
                          <Typography variant="body2">Cela peut prendre plus ou moins de temps, alors nous vous prions de patienter.</Typography>
                        </Box>)}
                  </Box>
                </>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "75px 0", maxWidth: "400px", margin: "0 auto" }}>
                  <Box sx={{ height: "fit-content", padding: "20px" }}><DataObject sx={{ scale: 3 }} /></Box>
                  <Typography variant="h5" sx={{ mb: "10px" }}>Aucun élément à afficher</Typography>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>Nous n'avons trouvé aucun élément à afficher concernant cette section.</Typography>
                </Box>
              )
            }
          </Box>
        )
      }
    </Show >
  );
};
