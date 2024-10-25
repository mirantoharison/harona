import React, { useEffect, useRef, useState, useCallback } from "react";
import { useList } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton, ListButton } from "@refinedev/mui";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search, Cancel } from "@mui/icons-material";
import { Box, Typography, Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Tag } from "../../components";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useNavigation } from "@refinedev/core";

interface SelectorProps {
  _id: string;
  displayName?: string;
  name: string;
  selector: string;
  description?: string;
  attribute: { key: string, value: any }[];
}

export const SelectorAdd = () => {
  const fieldName = ["name", "displayName", "selector", "description"];
  const attributeArray = [
    { text: "Groupe", icon: (<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />), key: "group" },
    { text: "Tableau", icon: (<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />), key: "array" },
    { text: "Texte", icon: (<TextFields sx={{ color: "#FFC900", scale: .7 }} />), key: "text" },
    { text: "HTML", icon: (<Code sx={{ color: "#022FFF", scale: .7 }} />), key: "html" },
    { text: "Split", icon: (<Transform sx={{ color: "#1976D2", scale: .7 }} />), key: "split" },
    { text: "Attribut", icon: (<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />), key: "attrText" },
    { text: "Premier nombre", icon: (<LooksOne sx={{ color: "#E400B0", scale: .7 }} />), key: "firstNumber" },
    { text: "JSON", icon: (<DataObject sx={{ color: "#B80384", scale: .7 }} />), key: "json" }
  ]

  const [selectedGroup, setSelectedGroup] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{ key: string, value: boolean | number | string }[]>([{ key: "", value: false }]);
  const [selectElements, setSelectElements] = useState([[...attributeArray]]);
  const { push } = useNavigation();

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger
  } = useForm<SelectorProps, HttpError, SelectorProps>({
    refineCoreProps: {
      resource: "selectors",
      action: "create",
      onMutationError(error, variables, context, isAutoSave) {
        console.log(error)
      },
      onMutationSuccess(data, variables, context, isAutoSave) {
        setTimeout(() => {
          push("/selector/list");
        }, 3000)
      },
    },
  });

  const computeSelectElements = (key: string, selectedAttributes: { key: string, value: boolean | number | string }[]) => {
    const newAttributes = [];
    const selectedKeys = selectedAttributes.map(attr => attr.key);

    if (key === "text") {
      const filteredAttributes = attributeArray.filter(attr =>
        (["firstNumber", "split"].includes(attr.key)) ||
        ([...selectedKeys].includes("array") === false && attr.key === "array")
      );
      newAttributes.push(...filteredAttributes);
    } else if (key === "array") {
      const filteredAttributes = attributeArray.filter(attr =>
        (["firstNumber", "json", "html"].includes(attr.key)) ||
        ([...selectedKeys].includes("text") === false && attr.key === "text")
      );
      newAttributes.push(...filteredAttributes);
    }

    return newAttributes;
  }

  const handleAttributeChange = useCallback(async (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value) {
      const updatedAttributes = [...selectedAttributes];
      updatedAttributes[index] = { key: event.target.value, value: "" };
      setSelectedGroup(updatedAttributes.map(attr => attr.key).includes("group") ? true : false);
      setSelectedAttributes(updatedAttributes.slice(0, index + 1));

      const updatedSelectElements = [...selectElements];
      const nextItem = index + 1;
      if (updatedSelectElements[nextItem]) {
        updatedSelectElements[nextItem] = computeSelectElements(event.target.value, updatedAttributes);
        setSelectElements(updatedSelectElements.slice(0, index + 1));
      }

      if (updatedAttributes.map(attr => attr.key).includes("group")) setValue("selector", "");

      for (const key of fieldName) {
        await trigger(key);
      }
    }
  }, [selectedAttributes, selectElements]);
  const handleAddAttribute = () => {
    const lastAttribute = selectedAttributes[selectedAttributes.length - 1];

    if (lastAttribute.key !== "") {
      const newAttributes = computeSelectElements(lastAttribute.key, selectedAttributes);
      const newSelectElements = [...selectElements];
      newSelectElements.push(newAttributes);

      setSelectedAttributes([...selectedAttributes, { key: "", value: "" }]);
      setSelectElements([...newSelectElements]);
    }
  };
  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = selectedAttributes.filter((_, i) => i !== index);
    setSelectedAttributes(updatedAttributes);

    const updatedSelectElements = [...selectElements];
    const previousItem = index - 1;
    const nextItem = index + 1;
    if (updatedSelectElements[nextItem]) {
      updatedSelectElements[nextItem] = computeSelectElements(selectedAttributes[previousItem].key, updatedAttributes);
    }

    setSelectElements(updatedSelectElements.filter((_, i) => i !== index));
  };

  const changeDelimiterForSplit = (index: number, event) => {
    const updatedAttributes = [...selectedAttributes];
    updatedAttributes[index].value = event.target.value;
    setSelectedAttributes(updatedAttributes);
  }
  const cancel = () => {
    push("/selector/list")
  }

  return (
    <Create
      isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">Créer un nouveau sélécteur</Typography>)
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton onClick={cancel} children={"Liste des sélecteurs"}></ListButton>
          {defaultButtons}
        </>
      )}
      saveButtonProps={{
        ...saveButtonProps,
        children: "Enregistrer le sélecteur",
        variant: "contained",
        color: "primary",
      }}
      footerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button color="error" variant="contained" onClick={cancel}>Annuler</Button>
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
            {...register("displayName", { required: "" })}
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
            {...register("selector", { required: !selectedGroup ? "Ce champs est obligatoire" : "" })}
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
            disabled={selectedGroup}
          />
          {selectedAttributes.map((attribute, index) => (
            <Box
              key={index}
              sx={{
                mt: "20px",
                display: "flex",
                columnGap: "5px",
                alignItems: "flex-end"
              }}
            >
              <TextField
                select
                variant="standard"
                label="Sélectionner un attribut pour le sélecteur ..."
                value={attribute.key}
                onChange={(event) => handleAttributeChange(index, event)}
                sx={{ minWidth: "300px", "& .MuiInputBase-input": { fontSize: ".875rem" } }}
                InputLabelProps={{ shrink: true }}
              >
                {
                  selectElements[index].map((attr) => (
                    <MenuItem key={attr.key} value={attr.key}>
                      {attr.text}
                    </MenuItem>
                  ))
                }
              </TextField>

              {
                attribute.key === "split" ? (
                  <TextField
                    variant="standard"
                    label="Délimiteur ..."
                    sx={{ "& .MuiInputBase-input": { fontSize: ".875rem" } }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => changeDelimiterForSplit(index, event)}
                  >
                  </TextField>
                ) : null
              }

              {
                index !== 0 ? (
                  <IconButton onClick={() => handleRemoveAttribute(index)} color="error" sx={{ scale: .75 }}>
                    <Cancel />
                  </IconButton>
                ) : null
              }

              {setValue(`attribute.${index}.key`, attribute.key)}
              {setValue(`attribute.${index}.value`, attribute.value)}
            </Box>
          ))}

          <Button onClick={handleAddAttribute} sx={{ mt: "20px" }}>Ajouter un nouvel attribut</Button>
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            {...register("description")}
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
            placeholder="VOus pouvez saisir une petite déscription du sélecteur ici."
          />
        </Grid>
      </Grid>
    </Create >
  )
}