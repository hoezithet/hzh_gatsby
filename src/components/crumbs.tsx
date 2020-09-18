import React from "react";
import { Breadcrumbs, Link } from '@material-ui/core';
import styled from 'styled-components';


export interface CrumbProps {
    crumbs: {
        slug: string;
        title: string;
    }[];
}

const BreadcrumbLink = styled(Link)`
    color: inherit;
`;

const Crumbs = ({ crumbs }: CrumbProps) => {

    const breadCrumbLinks = crumbs.map(({ slug, title }, index) => {
        if (index < crumbs.length - 1) {
            return (<BreadcrumbLink href={ slug }>
                        { title }
                    </BreadcrumbLink>);
        } else {
            return (<BreadcrumbLink href={ slug } aria-current="page">
                        { title }
                    </BreadcrumbLink>);
        }
    });

    return (
        <header>
            <Breadcrumbs aria-label="breadcrumb" maxItems={2}>
                { breadCrumbLinks }
            </Breadcrumbs>
        </header>
    );
}

export default Crumbs;