import { Stack, Box, Grid, Typography, SxProps, Theme, CircularProgress, } from "@mui/material";
import { Code, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Announcement } from "@mui/icons-material";
import { useShow, useParsed, useTranslation, Link } from "@refinedev/core";
import { Tag } from "../../components";
import { Show, ListButton, EditButton, DeleteButton, RefreshButton } from "@refinedev/mui";
import React, { useState, useEffect } from "react";
import { SelectorCard, SelectorData } from "./list";
import { Trans } from "react-i18next";

interface SelectorDetailConditionalFieldProps {
  style?: SxProps<Theme>;
  field: {
    label: string;
    value: React.ReactNode;
  };
}
const SelectorDetailContitionalField: React.FC<SelectorDetailConditionalFieldProps> = ({ style = {}, field }) => {
  if (field.label && field.value) {
    const isJSXElement = React.isValidElement(field.value);
    const isAlphaNumeric = typeof field.value === "string" || typeof field.value === "number";

    return (
      <>
        {
          field.label && field.value ? (
            <Box className="task-details-box" sx={{ ...style, wordBreak: "break-all" }}>
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

export const SelectorShow = () => {
  const { translate } = useTranslation();
  const { id } = useParsed();
  const { query } = useShow({ resource: "selectors", id });
  const { data, isLoading, isFetching, isError, refetch } = query;

  const [selector, setSelector] = useState<SelectorData>({});
  const [parent, setParentSelector] = useState([]);
  const [child, setChildSelector] = useState([]);

  const handleRefetch = () => {
    refetch();
  }

  useEffect(() => {
    if (data) {
      const selector = { ...data.data.selector };
      const parent = data.data.parent ? [data.data.parent] : [];
      const child = data.data.child && data.data.child.length > 0 ? data.data.child : [];
      setSelector(selector);
      setParentSelector(parent);
      setChildSelector(child);
    }
  }, [data]);

  return (
    <Show
      canDelete={true}
      canEdit={true}
      title={
        <Typography variant="h4">{translate("pages.selectors.show.title", { id })}</Typography>
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
        refreshButtonProps
      }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps} title={translate("pages.selectors.show.headerButtons.listTooltip")}>{translate("pages.selectors.show.headerButtons.list")}</ListButton>
          )}
          {refreshButtonProps && (
            <RefreshButton {...refreshButtonProps} title={translate("pages.selectors.show.headerButtons.refreshTooltip")} onClick={handleRefetch}>{translate("pages.selectors.show.headerButtons.refresh")}</RefreshButton>
          )}
          {editButtonProps && (
            <EditButton {...editButtonProps} title={translate("pages.selectors.show.headerButtons.editTooltip")}>{translate("pages.selectors.show.headerButtons.edit")}</EditButton>
          )}
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} title={translate("pages.selectors.show.headerButtons.deleteTooltip")}>{translate("pages.selectors.show.headerButtons.delete")}</DeleteButton>
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
          marginTop: "30px",
        },
      }}
    >
      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        {
          isLoading || isFetching ?
            (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "50px",
                }}
              >
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: "20px" }}>{translate("pages.selectors.show.loadingSelectorDetails")}</Typography>
                <Typography
                  variant="body2"
                  sx={{ width: "50%", minWidth: "400px", marginTop: "10px" }}
                >
                  <Trans
                    i18nKey="pages.selectors.show.loadingSelectorDetailsMessage"
                    values={{ id }}
                    components={{
                      selector: <Typography fontWeight="bold">{id}</Typography>,
                    }}
                  />
                </Typography>
              </Box>
            ) :
            (
              <Grid container spacing={2}>
                <Grid item sm={12} md={12} lg={6} xl={4}>
                  <Box sx={{ padding: 2, backgroundColor: "#ffffff", borderRadius: "4px", borderBottom: "1px solid #bbbbbb", borderRight: "1px solid #bbbbbb", height: "100%" }}>
                    <Typography variant="h6" sx={{ mb: "15px", pb: "15px", borderBottom: "1px solid #f5f5f5" }}>{translate("pages.selectors.show.general.title")}</Typography>
                    <Stack rowGap={"10px"}>
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.id"), value: selector._id }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.name"), value: selector.name }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.displayName"), value: selector.displayName }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.createdOn"), value: "00/00/0000 00:00:00" }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.editedOn"), value: "00/00/0000 00:00:00" }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.createdBy"), value: "Miranto Harison" }} />
                      <SelectorDetailContitionalField field={{ label: translate("pages.selectors.show.general.selector"), value: selector.selector }} />
                      <Typography variant="body1" fontWeight={"bold"}>{translate("pages.selectors.show.general.attribute")}</Typography>
                      <Box sx={{display: "flex", rowGap: "6px", columnGap: "6px", flexWrap: "wrap"}}>
                        {selector.group ? (<Tag icon={(<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />)} text={translate("pages.selectors.tags.group")} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.array ? (<Tag text={translate("pages.selectors.tags.array")} icon={(<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.text ? (<Tag text={translate("pages.selectors.tags.text")} icon={(<TextFields sx={{ color: "#FFC900", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.html ? (<Tag text={translate("pages.selectors.tags.html")} icon={(<Code sx={{ color: "#022FFF", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.trimText ? (<Tag text={translate("pages.selectors.tags.split")} icon={(<Transform sx={{ color: "#1976D2", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.attrText ? (<Tag text={translate("pages.selectors.tags.attribute")} icon={(<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.firstNumber ? (<Tag text={translate("pages.selectors.tags.number")} icon={(<LooksOne sx={{ color: "#E400B0", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                        {selector.json ? (<Tag text={translate("pages.selectors.tags.json")} icon={(<DataObject sx={{ color: "#B80384", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                      </Box>
                      {
                        selector.description ? (
                          <>
                            <Typography variant="body1" fontWeight={"bold"}>{translate("pages.selectors.show.general.description")}</Typography>
                            <Typography variant="body2">{selector.description}</Typography>
                          </>
                        ) : null
                      }
                    </Stack>
                  </Box>
                </Grid>
                <Grid item sm={12} md={12} lg={6} xl={8}>
                  {parent.length > 0 || child.length > 0 ? (
                    <Box sx={{ height: "100%" }}>
                      {
                        parent.length > 0 ?
                          (
                            <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f5f5f5" }}>
                              <Typography variant="h6" sx={{ mb: "5px" }}>{translate("pages.selectors.show.parent")}</Typography>
                              <Grid container spacing={2}>
                                {
                                  parent.map((item) => (<Grid item sm={12} md={6} lg={12} xl={4} key={item._id}><SelectorCard selector={item}></SelectorCard></Grid>))
                                }
                              </Grid>
                            </Box>
                          ) :
                          null
                      }

                      {
                        child.length > 0 ? (
                          <Box>
                            <Typography variant="h6" sx={{ mb: "5px" }}>{translate("pages.selectors.show.child", { s: child.length > 1 ? "s" : "" })}</Typography>
                            <Grid container spacing={2}>
                              {
                                child.map((item: SelectorData) => (<Grid item sm={12} md={6} lg={12} xl={4} key={item._id}><SelectorCard selector={item}></SelectorCard></Grid>))
                              }
                            </Grid>
                          </Box>
                        ) : null
                      }
                    </Box>
                  ) : (
                    <Box sx={{ width: "50%", textAlign: "center", margin: "0 auto", padding: "50px 0" }}>
                      <Announcement sx={{ scale: 4 }}></Announcement>
                      <Typography variant="h5" sx={{ mt: "40px" }}>{translate("pages.selectors.show.noRelatedLabel")}</Typography>
                      <Typography variant="body2" sx={{ mt: "10px" }}>
                        <Trans
                          i18nKey="pages.selectors.show.noRelatedMessage"
                          values={{ id }}
                          components={{
                            link: <a className="link" href={`/selector/update/${id}`}>{translate("pages.selectors.show.noRelatedLinkRedirect")}</a>,
                          }}
                        />
                      </Typography>
                    </Box>
                  )}

                </Grid>
              </Grid >
            )
        }
      </Box >
    </Show >
  );
};
