import React, { useState } from "react";
import { useList } from "@refinedev/core";
import { List } from "@refinedev/mui";
import { Settings, Refresh } from "@mui/icons-material";
import { Breadcrumbs, Link, Box, Typography, Button } from "@mui/material";
import { CreateSelectorForm } from "./create";

export const SelectorConfigList = () => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleRefresh = () => { }
  const handleAddGroup = () => { }
  const handleOpen = () => { setOpen(true); }
  const handleClose = () => { }
  const handleRefetch = () => {}

  const { data, isLoading, refetch, } = useList({
    resource: "selectors",
    pagination: {
      current: page,
      pageSize: pageSize,
      mode: "server",
    },
    filters: []
  });

  console.log(data);

  const items = [{ label: 'Test' }, { label: 'Annuaire' }, { label: 'REcette' }]

  return (
    <>
      <List
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Settings sx={{ marginRight: 1 }} />
            <Typography variant="h6">Liste des selecteurs enregistrés dans la base de données</Typography>
          </Box>
        }
        headerButtons={({ defaultButtons }) => (
          <>
            <Button type="button" onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}>
              <Refresh sx={{ marginRight: 1 }} />
              Rafraichir
            </Button>
            <Button type="button" onClick={handleAddGroup} sx={{ display: "flex", alignItems: "center" }}>
              Ajouter un nouveau groupe
            </Button>
            {defaultButtons}
          </>
        )}
        createButtonProps={{
          children: "Ajouter un nouveau sélécteur",
          onClick: handleOpen
        }}
        contentProps={{
          style: {
            padding: 0,
          }
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          {items.map((item, index) => (
            <Link
              key={index}
              color={index === items.length - 1 ? 'text.primary' : 'inherit'}
              onClick={() => null}
              style={{ cursor: 'pointer' }}
            >
              {item.label}
            </Link>
          ))}
          {items.length === 0 && <Typography color="text.primary">Home</Typography>}
        </Breadcrumbs>
      </List>

      <CreateSelectorForm open={open} onClose={handleClose} />
    </>
  );
};
