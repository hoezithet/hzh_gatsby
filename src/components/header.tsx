import React from "react";
import { Breadcrumbs, Link } from '@material-ui/core';


interface HeaderProps {
    slug: string;
}

const Header = ({ slug }: HeaderProps) => {
    const slugItems = slug.split('/').slice(1);
    const breadCrumbLinks = slugItems.map((item, index) => {
        const href = slugItems.slice(0, index + 1).join('/');
        if (index < slugItems.length - 1) {
            return (<Link href={ href } color="inherit">
                        { item }
                    </Link>);
        } else {
            return (<Link href={ href } color="textPrimary" aria-current="page">
                        { item }
                    </Link>);
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