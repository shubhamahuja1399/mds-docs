/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import '@fontsource/nunito-sans';
import {
  Row,
  Column,
  Heading,
  Button,
  Toast,
} from '@innovaccer/design-system';
import LeftNav from './LeftNav';
import TableOfContent from './TableOfContent/TableOfContent';
import Header from './Header';
import Container from './Container';
import ComponentsContainer from './Container/ComponentsContainer';
import { MDXProvider } from "@mdx-js/react";
import * as MDSComponents from '@innovaccer/design-system';
import Meta from './Meta';
import '../css/style.css';
import PropsTable from '../components/PropsTable/index';
import Rules from './Rules/Rules';
import DOs from './Rules/DOs';
import DONTs from './Rules/DONTs';
import InlineMessage from './Rules/InlineMessage';
import IconWrapper from './Rules/IconWrapper';
import Footer from './Footer/Footer';
import ProductLogos from '../components/Logos/Logos';
import ProductColors from '../components/Colors/Colors';
import { getStorybookData } from '../util/StorybookData';
import { ArgsTable } from '../components/PropsTable/Table';
import Markdown from 'markdown-to-jsx';

const copyToClipboard = (str) => {
  let codeBlock = '';
  if (Object.keys(str).length > 0) {
    const element = str.props.children;
    if (Array.isArray(element) && element.length) {
      element.map((elt) => {
        if (typeof elt === 'object') {
          codeBlock = codeBlock + elt.props.children;
        } else {
          codeBlock = codeBlock + elt;
        }
      });
    } else {
      codeBlock = str.props.children;
    }
  }
  navigator.clipboard.writeText(codeBlock);
};

const Code = ({ children, ...rest }) => {
  return (
    <>
      <div {...rest}>{children}</div>
      <Button
        icon='copy'
        className='ml-auto p-0'
        onClick={() => copyToClipboard(children)}
      />
    </>
  );
};

const List = ({ children, ...rest }) => {
  return (
    <div className='list'>
      {children}
    </div>
  )
}

const leftMenuList = [
  {
    title: 'Gatsby Theme MDS'
  }
];

const Layout = ({
  children,
  titleType,
  pageTitle,
  pageDescription,
  pageKeywords,
  relativePagePath,
  component,
  tabs,
  logos,
  showMobile,
  ...rest
}) => {
  const is404 = children && children.key === null;
  const [isToastActive, setIsToastActive] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  function getJsxCode(name) {
    const componentData = getStorybookData(name);

    const jsxCode = componentData && componentData.parameters
      ? componentData.parameters.docs.docPage?.customCode ||
      componentData.parameters.storySource.source
      : '';
    return jsxCode;
  }

  function getPropTableData(name) {
    const componentData = getStorybookData(name);

    const jsxCode = componentData
      ? componentData.parameters.argTypes
      : '';
    return jsxCode;
  }

  const Preview = ({ name }) => {
    return (
      <div>
        <PropsTable
          componentData={getJsxCode(name)}
        />
      </div>
    );
  };

  const A11yBlock = ({ name }) => {
    const componentData = getStorybookData(name);
    const a11yProps = componentData && componentData.parameters.docs.docPage?.a11yProps;
    return (
      <div className="mb-8">
        {a11yProps && <Markdown className="A11y-markdown">{a11yProps}</Markdown>}
      </div>
    );
  }

  const PreviewWithPropTable = ({ name }) => {
    return (
      <div>
        <ArgsTable rows={getPropTableData(name)} />
      </div>
    );
  };

  const toggleToast = (name) => {
    setIsToastActive(true);
    setToastTitle(name);
    setTimeout(() => setIsToastActive(false), 1500);
  }

  const Logos = ({ children, logoData, ...rest }) => {
    return (
      <ProductLogos
        logoData={logoData}
        toggleToast={toggleToast}
      />
    );
  };

  const Rectangle = ({ name, ...rest }) => {
    return (
      <div className='rectangle'>{name}</div>
    );
  };

  const Colors = ({ children, colorData, ...rest }) => {
    return (
      <ProductColors
        colorData={colorData}
        toggleToast={toggleToast}
      />
    );
  };

  const DSComponents = {
    ...MDSComponents,
    pre: Code,
    Preview: Preview,
    PreviewWithPropTable: PreviewWithPropTable,
    A11yBlock: A11yBlock,
    Rules,
    DOs,
    DONTs,
    InlineMessage,
    IconWrapper,
    h1: (props) => <Heading size='xxl' {...props} />,
    h2: (props) => <Heading size='xl' {...props} />,
    h3: (props) => <Heading size='l' {...props} />,
    h4: (props) => <Heading size='m' {...props} />,
    h5: (props) => <Heading size='s' {...props} />,
    ul: List,
    Logos: (props) => <Logos {...props} />,
    Rectangle: (props) => <Rectangle {...props} />,
    Colors: (props) => <Colors {...props} />,
  };
  return (
    <>
      <Meta
        titleType={titleType}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageKeywords={pageKeywords}
      />
      <Header
        leftMenuList={leftMenuList}
        relativePagePath={relativePagePath}
      />
      <Row style={{ height: 'calc(100vh - 48px)' }}>
        <LeftNav
          is404Page={is404}
          relativePagePath={relativePagePath}
          pageTitle={pageTitle}
          showMobile={showMobile}
        />
        <Column className="page-scroll h-100">
          <Row>
            <Column className="px-12 py-8 min-vh-100" size={9}>
              {!relativePagePath.includes('components') && (
                <Container
                  pageTitle={pageTitle}
                  relativePagePath={relativePagePath}
                  tabs={tabs}
                  pageDescription={pageDescription}
                  logos={logos}
                >
                  <MDXProvider components={DSComponents}>
                    {children}
                  </MDXProvider>
                </Container>
              )}
              {relativePagePath.includes('components') && (
                <ComponentsContainer
                  pageTitle={pageTitle}
                  relativePagePath={relativePagePath}
                  component={component}
                  tabs={tabs}
                  pageDescription={pageDescription}
                >
                  <MDXProvider components={DSComponents}>
                    {children}
                  </MDXProvider>
                </ComponentsContainer>
              )}
            </Column>

            <Column
              size={3}
              className="pb-6 in-page-nav position-sticky"
            >
              <TableOfContent
                is404Page={is404}
                relativePagePath={relativePagePath}
                pageTitle={pageTitle}
                location={rest.location}
              />
            </Column>
          </Row>
          {isToastActive && (
            <Toast
              appearance='success'
              title={toastTitle}
              className='position-fixed ml-5 toast'
              onClose={() => setIsToastActive(false)}
            />
          )}
          <Footer relativePagePath={relativePagePath} />
        </Column>
      </Row>
    </>
  );
};

export default Layout;
