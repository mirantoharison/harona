import React, { useEffect, useRef, useState } from "react";
import { useList } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search } from "@mui/icons-material";
import { Box, Typography, Button, Stack, Card, CardContent, SxProps, Theme, Grid, Pagination, Select, MenuItem, TextField, InputAdornment, CircularProgress, FormControl, InputLabel, Checkbox, FormControlLabel } from "@mui/material";
import { Tag } from "../../components";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useTranslate } from "@refinedev/core";

interface SelectorProps {
  _id: string;
  displayName?: string;
  name: string;
  selector: string;
  description?: string;
  attribute: string;
}

export const SelectorAdd = () => {
  const [attribute, setAttribute] = useState("text");
  const attributeArray = [
    { text: "Groupe", icon: (<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />), key: "group" },
    { text: "Tableau", icon: (<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />), key: "array" },
    { text: "Texte", icon: (<TextFields sx={{ color: "#FFC900", scale: .7 }} />), key: "text" },
    { text: "HTML", icon: (<Code sx={{ color: "#022FFF", scale: .7 }} />), key: "html" },
    { text: "Split", icon: (<Transform sx={{ color: "#1976D2", scale: .7 }} />), key: "split" },
    { text: "Attribut", icon: (<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />), key: "attrText" },
    { text: "Premier nombre", icon: (<LooksOne sx={{ color: "#E400B0", scale: .7 }} />), key: "firstNumber" },
    { text: "JSON", icon: (<DataObject sx={{ color: "#B80384", scale: .7 }} />), key: "json" }
  ].sort((a, b) => a.key.localeCompare(b.key));
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<SelectorProps, HttpError, SelectorProps>({
    refineCoreProps: {
      resource: "selectors",
      action: "create"
    }
  });

  const handleAttributeChange = (event) => {
    setAttribute(event.target.value);
  }

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      headerProps={{
        title: (<Typography variant="h4">Créer un nouveau sélécteur</Typography>)
      }}
    >
      <Grid
        container
        spacing={2}
        component="form"
        autoComplete="off"
      >
        <Grid item sm={12} md={6}>
          <TextField
            {...register("name", {
              required: "Ce champs est obligatoire",
            })}
            variant="standard"
            error={!!errors?.name}
            helperText={<>{errors?.name?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Nom"}
            name="name"
            className="custom-input"
          />
          <TextField
            {...register("displayName")}
            variant="standard"
            error={!!errors?.displayName}
            helperText={<>{errors?.displayName?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Nom d'affichage"}
            name="displayName"
            className="custom-input"
          />
          <TextField
            {...register("selector")}
            variant="standard"
            error={!!errors?.selector}
            helperText={<>{errors?.selector?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Sélecteur"}
            name="selector"
            className="custom-input"
          />
          <TextField
            {...register("attribute")}
            select
            variant="standard"
            label="Sélectionner un attribut pour le sélecteur ..."
            value={attribute}
            sx={{
              "& .MuiInputBase-input": { fontSize: ".875rem" },
              minWidth: "300px",
              mt: "20px"
            }}
            onChange={handleAttributeChange}
          >
            {
              attributeArray.map((attribute: object) => (
                <MenuItem key={attribute.key} value={attribute.key}>
                  {attribute.text}
                </MenuItem>
              ))
            }
          </TextField>
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            {...register("description", { required: true })}
            variant="standard"
            error={!!errors?.description}
            helperText={<>{errors?.description?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Description"}
            name="description"
            className="custom-input"
            multiline={true}
            placeholder={
              `Vous pouvez saisir ici une petite description du selecteur. 
              
Mauris ultrices tortor fringilla pretium tincidunt. Mauris vitae diam mattis, pretium sem et, pulvinar quam. Aenean eleifend luctus est, id blandit mauris aliquet eu. Nam accumsan scelerisque tristique. Duis a velit at leo mollis posuere. Cras congue elementum augue ac dictum. Curabitur sollicitudin quam neque, nec ultrices velit varius nec. Nunc in bibendum tellus, vitae porttitor ligula. Nullam faucibus non sem quis scelerisque. Nam consequat efficitur finibus. Phasellus sagittis, justo id suscipit blandit, lorem ipsum lobortis elit, nec pharetra magna justo ut urna. Donec maximus ante eu sagittis bibendum. Sed a massa lacus. Suspendisse non mauris non ante dictum bibendum tempor et urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst.
              `}
          />
        </Grid>
      </Grid>
    </Create >
  )
}