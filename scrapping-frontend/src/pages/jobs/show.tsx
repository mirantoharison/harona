import { Tabs, Tab, Stack, Box, Grid, Select, MenuItem, Typography, Card, CardContent, SxProps, Theme, CircularProgress, Pagination, Button, SelectChangeEvent, useTheme } from "@mui/material";
import { LinkOutlined, Star, DataObject, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft, PlayArrow } from "@mui/icons-material";
import { useShow, useParsed, useList, useTranslation, useCustom, useNavigation } from "@refinedev/core";
import { StateCell, Tag } from "../../components";
import {
  Show,
  ListButton,
  EditButton,
  DeleteButton,
  ExportButton,
} from "@refinedev/mui";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { dataProvider } from "../../providers/mockDataProvider";

interface TaskDetailConditionalFieldProps {
  style?: SxProps<Theme>;
  field: {
    label: string;
    value: React.ReactNode; // ReactNode to accommodate both strings and JSX elements
  };
}

interface TaskReviewProps {
  id: number;
  reviewerName: string;
  reviewerStar: number;
  reviewNote: string;
  reviewDate: string;
  reviewerLink: string;
}

interface TaskReviewCardProps {
  style?: SxProps<Theme>;
  review: TaskReviewProps;
}

const TaskReviewCard: React.FC<TaskReviewCardProps> = ({ review, style }) => {
  const [fullNote, setFullNote] = useState(false);
  const showFullNote = () => {
    setFullNote(!fullNote);
  }
  const { translate } = useTranslation();

  return (
    <Card sx={{ ...style, height: "100%" }}>
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
        {review.reviewDate ? (<Typography variant="body2">{translate("pages.jobs.show.tab.reviews.reviewCard.postedOn", { date: review.reviewDate })}</Typography>) : null}
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
              {translate("pages.jobs.show.tab.reviews.reviewCard.noReview")}
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
              title={translate("pages.jobs.show.tab.reviews.reviewCard.reviewLinkRedirection")}>
              {
                fullNote ?
                  (<Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="body1" sx={{ fontSize: ".9rem" }}>{translate("pages.jobs.show.tab.reviews.reviewCard.reviewSomeNote")}</Typography><KeyboardDoubleArrowLeft sx={{ scale: .8 }} /></Box>) :
                  (<Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="body1" sx={{ fontSize: ".9rem" }}>{translate("pages.jobs.show.tab.reviews.reviewCard.reviewFullNote")}</Typography><KeyboardDoubleArrowRight sx={{ scale: .8 }} /></Box>)
              }
            </a>
          ) : null
        }
      </CardContent>
    </Card>
  );
}

const TaskDetailContitionalField: React.FC<TaskDetailConditionalFieldProps> = ({ style = {}, field }) => {
  if (field.label && field.value) {
    const isJSXElement = React.isValidElement(field.value);
    const isAlphaNumeric = typeof field.value === "string" || typeof field.value === "number";

    return (
      <>
        {
          field.label && field.value ? (
            <Box className="task-details-box" sx={style}>
              <Typography sx={{ wordBreak: "break-all" }} variant="body2" fontWeight={"bold"}>{field.label} :</Typography>
              {isJSXElement ? field.value : isAlphaNumeric ? (<Typography variant="body2" sx={{ wordBreak: "break-all" }}>{field.value}</Typography>) : ""}
            </Box >
          ) : ("")
        }
      </>
    );
  }
  return (<></>);
}

export const JobShow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [canRetry, setCanRetry] = useState(false);
  const theme = useTheme();

  const { translate } = useTranslation();
  const { push } = useNavigation();
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

  const { data: retryData, isLoading: retryLoading, isFetching: retryFetching, isRefetching: retryRefetching, isSuccess } = useCustom({
    url: `${dataProvider.getApiUrl()}/jobs/retry`,
    method: "get",
    config: {
      query: { id }
    },
    queryOptions: {
      enabled: canRetry,
    },
    successNotification: (data, values) => {
      setTimeout(() => {
        push("/jobs/list");
      }, 3000);

      return {
        message: translate("pages.error.retryMessage"),
        description: translate("pages.error.retryDescription"),
        type: "success",
      };
    },
    errorNotification: (data, values) => {
      return {
        message: translate("pages.error.retryMessage"),
        description: translate("pages.error.retryDescription"),
        type: "error",
      };
    },
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

  const handleRetry = (id: number) => {
    setCanRetry(true);
  }

  useEffect(() => {
    if (canRetry && isSuccess) {
      setCanRetry(false);
    }
  }, [canRetry, isSuccess])


  return (
    <Show
      isLoading={isLoading || retryFetching || retryRefetching}
      canDelete={true}
      canEdit={jobData?.state !== 'completed'}
      title={
        <Typography variant="h4">{translate("pages.jobs.show.title", { id })}</Typography>
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
        <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: "10px", rowGap: "10px" }}>
          {listButtonProps && (
            <ListButton {...listButtonProps} title={translate("pages.jobs.show.headerButtons.listTooltip")}>{translate("pages.jobs.show.headerButtons.list")}</ListButton>
          )}
          {editButtonProps && (
            <EditButton {...editButtonProps} title={translate("pages.jobs.show.headerButtons.editTooltip")}></EditButton>
          )}
          {
            (jobData?.state === 'failed') &&
            (<Button sx={{ display: "flex", gap: .8, alignItems: "center" }} onClick={() => handleRetry(id as number)}><PlayArrow />{translate("pages.jobs.show.headerButtons.launch")}</Button>)
          }
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} title={translate("pages.jobs.show.headerButtons.deleteTooltip")}></DeleteButton>
          )}
        </Box>
      )}
      footerButtonProps={{
        style: {
          padding: 0,
          margin: 0
        },
      }}
      wrapperProps={{
        sx: {
          ".MuiCardHeader-action": {
            width: "100%"
          }
        }
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
        style={{
          margin: "auto -16px",
          paddingTop: "0",
          paddingBottom: "0",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: "1px solid #f5f5f5"
        }}
      >
        <Tab label={translate("pages.jobs.show.tab.general.title")} />
        <Tab label={translate("pages.jobs.show.tab.details.title")} />
        <Tab label={translate("pages.jobs.show.tab.reviews.title")} />
      </Tabs>

      {activeTab === 0 && (
        <Box
          flex={1} className="task-details-section">
          {
            !isLoading ? (
              <Stack rowGap={"10px"}>
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.id") as string, value: jobData.id }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.name") as string, value: jobData.name }} />
                <TaskDetailContitionalField field={{
                  label: translate("pages.jobs.show.tab.general.url") as string,
                  value: (
                    <a href={jobData.data.url || "#"} target="_blank" style={{ display: "flex", columnGap: "8px" }} rel="noopener noreferrer" className="link">
                      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>{jobData.data.url}</Typography>
                      <LinkOutlined />
                    </a>
                  )
                }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.state") as string, value: (<StateCell row={{ state: jobData.state }} />) }} style={{ alignItems: "center" }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.createdOn") as string, value: jobData.timestamp }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.processedOn") as string, value: jobData.processedOn }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.finishedOn") as string, value: jobData.finishedOn }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.reviewTotal") as string, value: jobData.totalReviews }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.reviewCollected") as string, value: jobData.countReviewsScrapped }} />
                <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.general.comment") as string, value: jobData.comments }} style={{ flexDirection: "column" }} />
              </Stack>) : ("")
          }
        </Box>
      )}

      {activeTab === 1 && (
        <Box
          flex={1} className="task-details-section">
          {
            !isLoading && companyInfo !== undefined ? (
              <Grid container spacing={6} sx={{ alignItems: "flex-start" }}>
                <Grid item sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }} sm={12} md={7} lg={6} xl={4}>
                  <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.details.name"), value: companyInfo.title }} />
                  <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.details.type"), value: companyInfo.businessType }} />
                  <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.details.address"), value: companyInfo.address }} />
                  <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.details.plusCode"), value: companyInfo.plusCode }} />
                  <TaskDetailContitionalField field={{
                    label: translate("pages.jobs.show.tab.details.website"), value: (
                      <a className="link" href={companyInfo.website || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "flex", columnGap: "8px", wordBreak: "break-all" }}>
                        <Typography variant="body2">{companyInfo.website}</Typography>
                        <LinkOutlined />
                      </a>
                    )
                  }} />
                  <TaskDetailContitionalField field={{ label: translate("pages.jobs.show.tab.details.phone"), value: companyInfo.phone }} />
                  <TaskDetailContitionalField
                    field={{
                      label: translate("pages.jobs.show.tab.details.averageRate"),
                      value: (
                        <Tag icon={(<Star sx={{ color: '#FECD00', marginRight: .3, scale: .8 }} />)} text={translate("pages.jobs.show.tab.details.averageRateStarText", { average: companyInfo.averageReview, s: companyInfo.averageReview > 1 ? "s" : "" })} />
                      )
                    }}
                    style={{ alignItems: "center" }} />
                </Grid>
                <Grid item sx={{
                  display: "flex",
                  columnGap: "45px",
                  alignItems: "center"
                }} sm={12} md={5} lg={6} xl={8}>
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
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "75px 0", maxWidth: "400px", margin: "0 auto" }}>
                    <Box sx={{ height: "fit-content", padding: "20px" }}><DataObject sx={{ scale: 3 }} /></Box>
                    <Typography variant="h6" sx={{ mb: "10px" }}>Aucun élément à afficher</Typography>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>Nous n'avons trouvé aucun élément à afficher concernant cette section.</Typography>
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
                    placeContent: "space-evenly",
                    alignItems: "center",
                    borderTop: "1px solid #f5f5f5",
                    padding: "5px",
                    flexWrap: "wrap",
                    columnGap: "10px",
                    rowGap: "10px"
                  }}>
                    <Pagination
                      count={Math.ceil((reviewData?.total || 0) / pageSize)}
                      page={Number(reviewData.page)}
                      onChange={handlePageChange}
                    />
                    <Typography variant="body2">{
                      translate("pages.jobs.show.footerElementsCount", {
                        from: (reviewData?.page - 1) * pageSize + 1,
                        to: Math.min(reviewData?.page * pageSize, reviewData?.total || 0),
                        total: reviewData?.total ?? 0
                      })
                    }</Typography>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <Typography variant="body2">{translate("pages.jobs.show.footerElementsShowCount")}</Typography>
                      <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        sx={{
                          '.MuiOutlinedInput-notchedOutline': { border: "none" },
                          '.MuiSelect-select': {
                            padding: '10px 20px',
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#7b1fa2',
                          },
                        }}
                      >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  <Box sx={{ padding: 2, backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#545454" }}>
                    {!reviewFetching ? (
                      <Grid container spacing={2}>
                        {
                          reviewData?.data?.map((review, index) => {
                            const reviewWithIndex = { ...review, id: index + (reviewData?.page - 1) * pageSize + 1 } as { id: number } & TaskReviewProps;

                            return (
                              <Grid item sm={12} md={6} lg={4} xl={3} key={reviewWithIndex.id} sx={{ width: "100%" }}>
                                <TaskReviewCard review={reviewWithIndex} />
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
                          padding: "75px 0",
                          minWidth: "400px",
                          width: "50%",
                          margin: "0 auto",
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
                  <Typography variant="h6" sx={{ mb: "10px" }}>Aucun élément à afficher</Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>Nous n'avons trouvé aucun élément à afficher concernant cette section.</Typography>
                </Box>
              )
            }
          </Box>
        )
      }
    </Show >
  );
};
