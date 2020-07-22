import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import headerStyle from "./styles/header.module.scss";

interface HeaderProps {
	siteTitle: string;
}

const Header = ({ siteTitle }: HeaderProps) => (
  <header>
		<h1 style={{ margin: 0 }}>
			<Link to="/" style={{ color: `white`, textDecoration: `none`, }} >
				{siteTitle}
			</Link>
      <div className={headerStyle.example}></div>
		</h1>
	</header>
);

Header.propTypes = {
	siteTitle: PropTypes.string,
};

Header.defaultProps = {
	siteTitle: ``,
};

export default Header;
