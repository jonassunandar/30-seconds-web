import React from 'react';
import { Provider } from 'react-redux';
import createStore from 'state';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SnippetPage from './index';
import { fullSnippet, fullBlogSnippet } from 'fixtures/snippets';
import { breadcrumbs } from 'fixtures/breadcrumbs';

configure({ adapter: new Adapter() });
console.warn = jest.fn();

const { store } = createStore();

describe('<SnippetPage />', () => {
  const logoSrc = '/assets/logo.png';
  const splashLogoSrc = '/assets/splash.png';
  const cardTemplate = 'StandardSnippetCard';
  let wrapper, shell, meta, crumbs, snippetCard;

  beforeEach(() => {
    wrapper = mount(
      <Provider store={ store }>
        <SnippetPage pageContext={ {
          snippet:
          fullSnippet,
          splashLogoSrc,
          logoSrc,
          cardTemplate,
          breadcrumbs,
          pageDescription: '',
        } }/>
      </Provider>
    );
    shell = wrapper.find('Shell');
    meta = wrapper.find('Meta');
    crumbs = wrapper.find('Breadcrumbs');
    snippetCard = wrapper.find('SnippetCard');
  });

  describe('should render', () => {
    it('a Shell component', () => {
      expect(wrapper).toContainMatchingElement('Shell');
    });

    it('a Meta component', () => {
      expect(wrapper).toContainMatchingElement('Meta');
    });

    it('a Breadcrumbs component', () => {
      expect(wrapper).toContainMatchingElement('Breadcrumbs');
    });

    it('a SnippetCard component', () => {
      expect(wrapper).toContainMatchingElement('SnippetCard');
    });
  });

  it('should pass the correct data to the Shell component', () => {
    expect(shell.prop('logoSrc')).toBe(logoSrc);
  });

  it('should pass the correct data to the Meta component', () => {
    expect(meta.prop('logoSrc')).toBe(splashLogoSrc);
    expect(meta.prop('title')).toBe(fullSnippet.title);
  });

  it('should pass the breadcrumbs to the Breadcrumbs component', () => {
    expect(crumbs.prop('breadcrumbs')).toBe(breadcrumbs);
  });

  it('should pass the snippet data to the SnippetCard component', () => {
    expect(snippetCard.prop('snippet')).toEqual(fullSnippet);
  });

  describe('with a blog post', () => {
    beforeEach(() => {
      wrapper = mount(
        <Provider store={ store }>
          <SnippetPage pageContext={ {
            snippet: fullBlogSnippet,
            splashLogoSrc,
            logoSrc,
            cardTemplate: 'BlogSnippetCard',
            pageDescription: '',
            breadcrumbs,
          } }/>
        </Provider>
      );
      shell = wrapper.find('Shell');
      meta = wrapper.find('Meta');
      crumbs = wrapper.find('Breadcrumbs');
      snippetCard = wrapper.find('SnippetCardWrapper');
    });

    it('should pass the correct logoSrc to the Meta component', () => {
      expect(meta.prop('logoSrc')).toBe(fullBlogSnippet.cover.src);
    });
  });
});

