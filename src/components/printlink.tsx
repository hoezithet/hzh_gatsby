import React from "react";
import { Link } from 'gatsby-theme-material-ui';
import PrintIcon from '@material-ui/icons/Print';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import { Gray } from "./shortcodes/color";

interface PrintLinkProps {
  to: string;
}

const PrintLink = ({ to }: PrintLinkProps) => {
  return (
      <Link to={ to }>
      <Gray>
      <Grid container spacing={ 1 } align="center" >
          <Grid item >
              <PrintIcon />
          </Grid>
          <Grid item >
              Toon afdrukbare versie
          </Grid>
      </Grid>
      </Gray>
      </Link>
  )
}

export default PrintLink;