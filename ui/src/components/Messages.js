import React from 'react';
import {DataTable} from 'grommet';

export default function Messages(props) {
    const columns = [
        {
          property: "_id",
          header: "Id",
          primary: true
        },
        {
            property: "queue",
            header: "Queue",
        },
        {
          property: "payload",
          header: "Payload"
        }
    ];

    return (
        <DataTable columns={columns} data={props.messages} />
    );
}