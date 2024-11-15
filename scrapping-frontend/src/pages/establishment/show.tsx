import { Tabs, Tab, Stack, Box, Grid, Select, MenuItem, Typography, Card, CardContent, SxProps, Theme, CircularProgress, Pagination, Button, SelectChangeEvent, useTheme } from "@mui/material";
import { LinkOutlined, Star, DataObject, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft, PlayArrow, Stop } from "@mui/icons-material";
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
import { usePageTitle } from "../../components/title";

interface DetailConditionalFieldProps {
  style?: SxProps<Theme>;
  field: {
    label: string;
    value: React.ReactNode;
  };
}

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

const DetailContitionalField: React.FC<DetailConditionalFieldProps> = ({ style = {}, field }) => {
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

export const EstablishmentShow = () => {
  const [establishment, setEstablishment] = useState<EstablishmentProps | any>({});

  const { translate } = useTranslation();
  const { push } = useNavigation();
  const { id } = useParsed();
  const { query } = useShow({ resource: "establishment", id });
  const { data, isLoading } = query;
  const theme = useTheme();

  useEffect(() => {
    if(data?.data?.establishment){
      setEstablishment(data?.data?.establishment);
    }
  }, [data]);

  usePageTitle(`GMB | Détails concernant la tâche ${id}`);

  return (
    <Show
      isLoading={isLoading}
      canDelete={true}
      canEdit={true}
      title={
        <Typography variant="h4">{translate("pages.establishment.show.title", { id })}</Typography>
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
            <ListButton {...listButtonProps} title={translate("pages.establishment.show.headerButtons.listTooltip")}>{translate("pages.establishment.show.headerButtons.list")}</ListButton>
          )}
          {editButtonProps &&
            (<EditButton {...editButtonProps} title={translate("pages.establishment.show.headerButtons.editTooltip")}></EditButton>)}
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} title={translate("pages.establishment.show.headerButtons.deleteTooltip")}></DeleteButton>
          )}
        </Box>
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
        },
      }}
    >
      <Box
        flex={1} className="task-details-section">
        {
          !isLoading ? (
            <Stack rowGap={"10px"}>
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.name") as string, value: establishment?.name }} />
              <DetailContitionalField field={{
                label: translate("pages.establishment.create.fields.url") as string,
                value: (
                  <a href={establishment?.url} target="_blank" style={{ display: "flex", columnGap: "8px" }} rel="noopener noreferrer" className="link">
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>{establishment?.url}</Typography>
                    <LinkOutlined />
                  </a>
                )
              }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.description") as string, value: establishment?.description }} style={{ alignItems: "center" }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.number_of_reviews") as string, value: establishment?.number_of_reviews }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.formatted_address") as string, value: establishment?.formatted_address }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.lat") as string, value: establishment?.lat }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.long") as string, value: establishment?.long }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.place_id") as string, value: establishment?.place_id }} />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.plus_code") as string, value: establishment?.plus_code }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.rating") as string, value: establishment?.rating }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.types") as string, value: establishment?.types?.join("-") }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.website") as string, value: establishment?.website }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.is_establishment_found") as string, value: establishment?.is_establishment_found ? "Oui" : "Non" }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.postal_codet") as string, value: establishment?.postal_code }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.address_1") as string, value: establishment?.address_1 }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.categories") as string, value: establishment?.categories }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.about") as string, value: establishment?.about }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.search_key") as string, value: establishment?.search_key }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.country") as string, value: establishment?.country }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.phone") as string, value: establishment?.phone }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.town") as string, value: establishment?.town }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.area") as string, value: establishment?.area }}  />
              <DetailContitionalField field={{ label: translate("pages.establishment.create.fields.establishment_identifier") as string, value: establishment?.establishment_identifier }}  />
            </Stack>
          ) :
            ("")
        }
      </Box>
    </Show >
  );
};
