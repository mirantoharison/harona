import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import type { I18nProvider } from "@refinedev/core";
import { useTranslation } from "react-i18next";

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
//import dataProvider from "@refinedev/simple-rest";

import { dataProvider } from "./providers/mockDataProvider";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  JobList,
  JobShow,
  JobEdit,
  JobAdd
} from "./pages/jobs";
import {
  SelectorConfigList,
  SelectorShow,
  SelectorAdd,
  SelectorEdit
} from "./pages/selector";

import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { RegisterPage } from "./pages/register/register";
import { LoginPage } from "./pages/login/login";
import { authProvider as customAuthProvider } from "./providers/mockAuthProvider";

import { Settings, Google, Queue } from "@mui/icons-material";
import { Typography } from "@mui/material";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => {
      const result = t(key, options);
      return typeof result === "string" ?
        result :
        "null";
    },
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      {/*<GitHubBanner />*/}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                notificationProvider={notificationProvider}
                routerProvider={routerBindings}
                authProvider={customAuthProvider}
                resources={[
                  {
                    name: i18nProvider.translate("menu.task"),
                    list: "/jobs/list",
                    create: "/jobs/add",
                    edit: "/jobs/update/:id",
                    show: "/jobs/details/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  /*{
                    name: i18nProvider.translate("menu.selector"),
                    list: "/selector/list",
                    create: "/selector/add",
                    edit: "/selector/update/:id",
                    show: "/selector/details/:id",
                    icon: (<Settings />),
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: i18nProvider.translate("menu.queue"),
                    list: "/queue/list",
                    create: "/queue/add",
                    edit: "/queue/update/:id",
                    show: "/queue/details/:id",
                    icon: (<Queue />),
                    meta: {
                      canDelete: true,
                    },
                  }*/
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "H0olhS-soFqiq-OFO7pC",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={() => (
                            <ThemedSiderV2
                              Title={({ collapsed }) => (
                                <>
                                  <Google></Google>
                                  {
                                    !collapsed ? (<Typography variant="h6">GMB Scrap</Typography>) : null
                                  }
                                </>
                              )}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index path="/" element={<Navigate to="/jobs/list" />} />
                    <Route path="/jobs">
                      <Route index path="/jobs/list" element={<JobList />} />
                      <Route path="/jobs/add" element={<JobAdd />} />
                      <Route path="/jobs/update/:id" element={<JobEdit />} />
                      <Route path="/jobs/details/:id" element={<JobShow />} />
                    </Route>

                    {
                      /*
                      <Route path="/selector">
                        <Route index path="/selector/list" element={<SelectorConfigList />} />
                        <Route path="/selector/add" element={<SelectorAdd />} />
                        <Route path="/selector/details/:id" element={<SelectorShow />} />
                        <Route path="/selector/update/:id" element={<SelectorEdit />} />
                      </Route>
                      */
                    }
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider >
    </BrowserRouter >
  );
}

export default App;
