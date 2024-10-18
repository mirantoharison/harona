import { Tabs, Tab, Stack, Box, Grid, Select, MenuItem, Typography, Card, CardContent, SxProps, Theme, CircularProgress, Pagination, Button, SelectChangeEvent } from "@mui/material";
import { Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search } from "@mui/icons-material";
import { useShow, useParsed, useBreadcrumb, useList } from "@refinedev/core";
import { StateCell, Tag } from "../../components";
import {
  Show,
  ListButton,
  EditButton,
  DeleteButton,
} from "@refinedev/mui";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { SelectorCard } from "./list";

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
  const { id } = useParsed();
  const { query } = useShow({ resource: "selectors", id });
  const { data, isLoading, isFetching, isError, refetch } = query;

  const [selector, setSelector] = useState({});
  const [parent, setParentSelector] = useState([]);
  const [child, setChildSelector] = useState([]);
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
      isLoading={isLoading}
      canDelete={true}
      canEdit={true}
      title={
        <Typography variant="h4">
          Détails concernant le selecteur {id}
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
            <ListButton {...listButtonProps} title="Revenir vers la liste des sélecteur">Liste des sélecteurs</ListButton>
          )}
          {editButtonProps && (
            <EditButton {...editButtonProps} title="Modifier">Modifier</EditButton>
          )}
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
          marginTop: "30px",
        },
      }}
    >
      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={12} lg={6} xl={4}>
            <Box sx={{ padding: 2, backgroundColor: "#ffffff", borderRadius: "4px", borderBottom: "1px solid #bbbbbb", borderRight: "1px solid #bbbbbb", height: "100%" }}>
              <Typography variant="h6" sx={{ mb: "15px", pb: "15px", borderBottom: "1px solid #f5f5f5" }}>Informations générales</Typography>
              <Stack rowGap={"10px"}>
                <SelectorDetailContitionalField field={{ label: "ID", value: selector._id }} />
                <SelectorDetailContitionalField field={{ label: "Nom", value: selector.name }} />
                <SelectorDetailContitionalField field={{ label: "Nom d'affichage", value: selector.displayName }} />
                <SelectorDetailContitionalField field={{ label: "Date de création", value: "00/00/0000 00:00:00" }} />
                <SelectorDetailContitionalField field={{ label: "Date de modification", value: "00/00/0000 00:00:00" }} />
                <SelectorDetailContitionalField field={{ label: "Créé par", value: "Miranto Harison" }} />
                <SelectorDetailContitionalField field={{ label: "Selecteur", value: selector.selector }} />
                <Typography variant="body1" fontWeight={"bold"}>Attribut(s)</Typography>
                <Box>
                  {selector.group ? (<Tag icon={(<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />)} text="Groupe" style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.array ? (<Tag text="Tableau" icon={(<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.text ? (<Tag text="Texte" icon={(<TextFields sx={{ color: "#FFC900", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.html ? (<Tag text="HTML" icon={(<Code sx={{ color: "#022FFF", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.trimText ? (<Tag text="Split" icon={(<Transform sx={{ color: "#1976D2", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.attrText ? (<Tag text="Attribut" icon={(<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.firstNumber ? (<Tag text="Premier nombre" icon={(<LooksOne sx={{ color: "#E400B0", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                  {selector.json ? (<Tag text="JSON" icon={(<DataObject sx={{ color: "#B80384", scale: .7 }} />)} style={{ columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} />) : null}
                </Box>
                {
                  selector.description ? (
                    <>
                      <Typography variant="body1" fontWeight={"bold"}>Description</Typography>
                      <Typography variant="body2">{selector.description}</Typography>
                    </>
                  ) : null
                }
              </Stack>
            </Box>
          </Grid>
          <Grid item sm={12} md={12} lg={6} xl={8}>
            {true || true ? (
              <Box sx={{ height: "100%" }}>
                {
                  parent.length > 0 ?
                    (
                      <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f5f5f5" }}>
                        <Typography variant="h6" sx={{ mb: "5px" }}>Sélécteur parent</Typography>
                        <Grid container spacing={2}>
                          {
                            parent.map((item) => (<Grid item sm={12} md={6} lg={12} xl={4}><SelectorCard selector={item}></SelectorCard></Grid>))
                          }
                        </Grid>
                      </Box>
                    ) :
                    null
                }
                {
                  child.length > 0 ? (
                    <Box>
                      <Typography variant="h6" sx={{ mb: "5px" }}>Sélécteur{child.length > 1 ? "s" : ""} enfant{child.length > 1 ? "s" : ""}</Typography>
                      <Grid container spacing={2}>
                        {
                          child.map((item) => (<Grid item sm={12} md={6} lg={12} xl={4} key={item._id}><SelectorCard selector={item}></SelectorCard></Grid>))
                        }
                      </Grid>
                    </Box>
                  ) : null
                }
              </Box>
            ) : (
              <Box>Aucun élement connexe</Box>
            )}

          </Grid>
        </Grid>
      </Box>
    </Show>
  );
};
