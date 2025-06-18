// This file is part of InvenioRDM
// Copyright (C) 2024 TU Wien.
// Copyright (C) 2024 Graz University of Technology.
//
// Invenio-Curations is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Icon, Label } from "semantic-ui-react";

import React from "react";
import { i18next } from "@translations/invenio_curations/i18next";

export const LabelTypeRDMCuration = () => (
  <Label horizontal className="primary" size="small">
    {i18next.t("Curation review")}
  </Label>
);


