import * as React from "react";
import { User } from "../models/User";
import UserEditDialog from "./UserEditDialog";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from "material-ui";
import { TableEditIcon } from "mdi-react";
import DeleteIcon from "mdi-react/DeleteIcon";

import fileService from "../services/FileService";
import { toast } from 'react-toastify';
import { SummaryModel } from "../models/SummaryModel";

const rootStyle: React.CSSProperties = {
    overflowX: 'auto',
    width: '90%'
};

interface SummaryGridProps {
}

interface SummaryGridState {
    locations: SummaryModel[];
}

export default class SummaryGrid extends React.Component<SummaryGridProps, SummaryGridState> {
    constructor(props: SummaryGridProps) {
        super(props);

        this.state = {
            locations: []
        };
    }

    async componentDidMount() {
        this.setState({
            locations: await fileService.getSummary()
        });
    }


    render() {
        return (
            <Paper style={rootStyle}>
                <Table className="ordinalFontRoot">
                    <TableHead className="table-head-bold-font">
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell numeric>Total data length (bytes)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.locations.map(l => {
                            return (
                                <TableRow key={l.location}>
                                    <TableCell>{l.location}</TableCell>
                                    <TableCell numeric>{l.length}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}
