import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';

jest.mock('../src/components/AnimatedButton', () => (props: any) => <button {...props} />);
jest.mock('../src/components/BoardPickerModal', () => () => null);
jest.mock('../src/components/ShopTheLookModal', () => () => null);
jest.mock('../src/components/CommentsModal', () => () => null);
jest.mock('../src/components/MasonryLayout', () => ({ data, renderItem }: any) => (
  <div>{data.map((item: any, index: number) => <div key={item.id || index}>{renderItem(item, index)}</div>)}</div>
));

jest.useFakeTimers();

test('HomeScreen renders with default pins', () => {
  let tree: any;
  act(() => {
    tree = renderer.create(<HomeScreen onUpload={() => {}} onTabPress={() => {}} />);
  });
  expect(tree.toJSON()).toBeTruthy();
});
