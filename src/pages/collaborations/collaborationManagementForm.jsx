import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Button from '../../components/Button';
import CustomAlert from '../../components/Alert';
import useEstablishCollaborationAsUserManager from '../../models/collaboration/useEstablishCollaborationAsUserManager';

export default function CollaborationManagementForm({ userData }) {
  const intl = useIntl();
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const {
    establishCollaboration,
    loading,
    error,
    success,
  } = useEstablishCollaborationAsUserManager();
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginRight: 20,
        }}
      >
        <Autocomplete
          id="select-collaborator-1"
          style={{ marginBottom: '20px', marginRight: '20px' }}
          options={
            userData
              ? userData.filter(
                  user => get(user, 'guid', '') !== user2,
                )
              : []
          }
          getOptionLabel={option => {
            const name = get(option, 'full_name', null);
            if (name) return name;
            const email = get(option, 'email', null);
            return (
              intl.formatMessage({
                id: 'UNNAMED_USER',
              }) +
              ' (' +
              email +
              ')'
            );
          }}
          getOptionSelected={(option, val) =>
            option.id ? option.id === val : false
          }
          renderInput={params => (
            <TextField
              {...params}
              style={{ width: 280 }}
              variant="standard"
              label={<FormattedMessage id="SELECT_COLLABORATOR_1" />}
            />
          )}
          onChange={(_, newValue) => {
            setUser1(get(newValue, 'guid', ''));
          }}
        />
        <Autocomplete
          id="select-collaborator-2"
          style={{ marginBottom: '20px' }}
          options={
            userData
              ? userData.filter(
                  user => get(user, 'guid', '') !== user1,
                )
              : []
          }
          getOptionLabel={option => {
            const name = get(option, 'full_name', 'guid');
            if (name) return name;
            const email = get(option, 'email', null);
            return (
              intl.formatMessage({
                id: 'UNNAMED_USER',
              }) +
              ' (' +
              email +
              ')'
            );
          }}
          getOptionSelected={(option, val) =>
            option.id ? option.id === val : false
          }
          renderInput={params => (
            <TextField
              {...params}
              style={{ width: 280 }}
              variant="standard"
              label={<FormattedMessage id="SELECT_COLLABORATOR_2" />}
            />
          )}
          onChange={(_, newValue) => {
            setUser2(get(newValue, 'guid', ''));
          }}
        />

        <Button
          display="primary"
          size="small"
          style={{ marginBottom: '20px' }}
          loading={loading}
          onClick={async () => {
            const successful = await establishCollaboration(
              // need the await here. Otherwise, setShouldDisplay(true) below fires before this completes
              user1,
              user2,
            );
            setShouldDisplay(true);
          }}
        >
          <FormattedMessage id="CREATE_COLLABORATION" />
        </Button>
      </div>
      {success && shouldDisplay && (
        <CustomAlert
          style={{ margin: '0px 24px 20px 24px' }}
          titleId="COLLABORATION_CREATEDD"
          severity="success"
          onClose={() => {
            setShouldDisplay(false);
          }}
        />
      )}
      {error && shouldDisplay && (
        <CustomAlert
          style={{ margin: '20px 0', width: '100%' }}
          severity="error"
          titleId="SERVER_ERROR"
          onClose={() => {
            setShouldDisplay(false);
          }}
        >
          {error}
        </CustomAlert>
      )}
    </div>
  );
}
