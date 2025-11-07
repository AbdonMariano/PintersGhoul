import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';

jest.useFakeTimers();

test('HomeScreen renders with default pins', () => {
  let tree: any;
  act(() => {
    tree = renderer.create(<HomeScreen onUpload={() => {}} onTabPress={() => {}} />);
  });
  expect(tree.toJSON()).toBeTruthy();
});
