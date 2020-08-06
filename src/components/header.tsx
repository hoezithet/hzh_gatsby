import React from "react";
import { Breadcrumbs, Link } from '@material-ui/core';
import styled from 'styled-components';


interface HeaderProps {
    slug: string;
}

const BreadcrumbLink = styled(Link)`
    color: inherit;
`;

const Header = ({ slug }: HeaderProps) => {

    const slugItems = slug.split('/').slice(1);
    const breadCrumbLinks = slugItems.map((item, index) => {
        const href = slugItems.slice(0, index + 1).join('/');
        if (index < slugItems.length - 1) {
            return (<BreadcrumbLink href={ href }>
                        { item }
                    </BreadcrumbLink>);
        } else {
            return (<BreadcrumbLink href={ href } aria-current="page">
                        { item }
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

export default Header;