import React from "react";
import { Link } from 'gatsby-theme-material-ui';
import SvgIcon from '@material-ui/core/SvgIcon';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import { Gray } from "./shortcodes/color";

interface PrintLinkProps {
  to: string;
}

const PdfIcon = (props) => {
    return (
        <SvgIcon viewBox={"0 0 48 48"} {...props}>
            <path d="M18.64,32.71s.67-.27,1.77-2A7,7,0,0,0,18.64,32.71Z"></path><path d="M33.37,16.36l-5-5a1.22,1.22,0,0,0-.86-.35h-.3v6.48h6.48v-.31A1.21,1.21,0,0,0,33.37,16.36Z"></path>
            <path d="M26.84,19.14a1.22,1.22,0,0,1-1.22-1.22V11H15.49a1.21,1.21,0,0,0-1.21,1.22V35.74A1.21,1.21,0,0,0,15.49,37h17a1.21,1.21,0,0,0,1.21-1.22V19.14ZM29.16,30.4a7.63,7.63,0,0,1-3.24-1,29.47,29.47,0,0,0-4,1.18c-1.29,2.21-2.19,3.12-3.09,3.12a1.55,1.55,0,0,1-1.09-.5c-1-1.19,1.38-2.74,2.76-3.44h0a46.76,46.76,0,0,0,2.06-4.34,8.47,8.47,0,0,1-.41-3.9,1.27,1.27,0,0,1,2.42.34,7.14,7.14,0,0,1-.31,3.25,5.07,5.07,0,0,0,2.16,2.73c1-.13,3-.33,3.73.36A1.31,1.31,0,0,1,29.16,30.4Z"></path>
            <path d="M23.39,21.63a4.9,4.9,0,0,0,.1,2.38C23.77,23.5,23.81,21.63,23.39,21.63Z"></path>
            <path d="M23.4,26.39A22,22,0,0,1,22,29.57a18.51,18.51,0,0,1,3.19-1.11A6.62,6.62,0,0,1,23.4,26.39Z"></path><path d="M27.45,28.82c1.88.8,2.16.46,2.16.46C29.82,29.14,29.49,28.68,27.45,28.82Z"></path>
        </SvgIcon>
    );
};

const PrintLink = ({ to }: PrintLinkProps) => {
  return (
      <Link to={ to }>
      <Gray>
      <Grid container spacing={ 1 } align="center" >
          <Grid item >
              <PdfIcon />
          </Grid>
          <Grid item >
              Download deze les als pdf
          </Grid>
      </Grid>
      </Gray>
      </Link>
  )
}

export default PrintLink;