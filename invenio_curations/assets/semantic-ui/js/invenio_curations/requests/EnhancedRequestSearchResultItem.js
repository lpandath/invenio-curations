// This file is part of InvenioRDM
// Copyright (C) 2024 TU Wien.
// Copyright (C) 2024 Graz University of Technology.
//
// Invenio-Curations is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Button, Grid, Icon, Item, Label, Segment } from "semantic-ui-react";

import React from "react";
import RequestStatusLabel from "@js/invenio_requests/request/RequestStatusLabel";
import RequestTypeLabel from "@js/invenio_requests/request/RequestTypeLabel";
import { i18next } from "@translations/invenio_curations/i18next";
import { toRelativeTime } from "react-invenio-forms";

const getLastTimelineEvent = (request) => {
  if (!request.timeline || !Array.isArray(request.timeline) || request.timeline.length === 0) {
    return null;
  }

  const sortedEvents = [...request.timeline].sort((a, b) =>
    new Date(b.created) - new Date(a.created)
  );

  return sortedEvents[0];
};

const getCommunityInfo = (request) => {
  if (request.topic?.parent?.communities) {
    return request.topic.parent.communities;
  }
  if (request.topic?.communities) {
    return request.topic.communities;
  }
  return null;
};

const hasOpenCommunityReview = (request) => {
  if (request.topic?.parent?.requests) {
    return request.topic.parent.requests.some(req =>
      req.type === 'community-submission' &&
      req.status === 'submitted'
    );
  }
  return false;
};

const LastActivityInfo = ({ request }) => {
  const lastEvent = getLastTimelineEvent(request);

  if (!lastEvent) {
    return (
      <div className="text-muted small">
        <Icon name="clock outline" />
        Created {toRelativeTime(request.created, i18next.language)}
      </div>
    );
  }

  const eventTypeMapping = {
    'review': 'started review',
    'resubmitted': 'resubmitted',
    'critiqued': 'requested changes',
    'submit': 'submitted',
    'accept': 'accepted',
    'decline': 'declined'
  };

  const eventText = eventTypeMapping[lastEvent.type] || lastEvent.type;
  const userName = lastEvent.created_by?.profile?.full_name ||
                  lastEvent.created_by?.username ||
                  lastEvent.created_by?.email ||
                  'Unknown user';

  return (
    <div className="text-muted small">
      <Icon name="clock outline" />
      {eventText.charAt(0).toUpperCase() + eventText.slice(1)} {toRelativeTime(lastEvent.created, i18next.language)} by {userName}
    </div>
  );
};

const CommunityInfo = ({ request }) => {
  const communities = getCommunityInfo(request);
  const hasOpenReview = hasOpenCommunityReview(request);

  if (!communities && !hasOpenReview) {
    return null;
  }

  return (
    <div className="mt-5">
      {communities && communities.length > 0 && (
        <Label size="tiny" color="blue">
          <Icon name="users" />
          Community: {communities[0].metadata?.title || communities[0].slug}
        </Label>
      )}
      {hasOpenReview && (
        <Label size="tiny" color="orange" className="ml-5">
          <Icon name="eye" />
          Community review open
        </Label>
      )}
    </div>
  );
};

export const EnhancedRequestSearchResultItem = ({ result, index }) => {
  const request = result;

  return (
    <Item key={index} className="curation-request-item">
      <Item.Content>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Item.Header as="a" href={`/requests/${request.id}`} className="request-header">
                {request.title}
              </Item.Header>
              <Item.Meta className="request-meta">
                <div className="flex status-labels">
                  <RequestTypeLabel type={request.type} />
                  <RequestStatusLabel status={request.status} />
                </div>
              </Item.Meta>
              <Item.Description>
                <div className="activity-info">
                  <LastActivityInfo request={request} />
                </div>
                <div className="community-info">
                  <CommunityInfo request={request} />
                </div>
              </Item.Description>
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              <Button
                basic
                size="small"
                as="a"
                href={`/requests/${request.id}`}
                content="View"
                icon="arrow right"
                labelPosition="right"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Item.Content>
    </Item>
  );
};

export default EnhancedRequestSearchResultItem;
