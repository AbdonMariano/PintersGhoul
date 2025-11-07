import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ImageCard from '../src/components/ImageCard';

const samplePin = {
  id: '1',
  imageUri: 'https://picsum.photos/200/300',
  title: 'Test Pin',
  description: 'Descripción',
  author: 'Autor',
  likes: 0,
  isLiked: false,
  isSaved: false,
};

test('ImageCard renders without crashing', () => {
  let tree: any;
  act(() => {
    tree = renderer.create(
      <ImageCard
        pin={samplePin}
        onLike={() => {}}
        onSave={() => {}}
        onShowOptions={() => {}}
        onImagePress={() => {}}
      />
    );
  });
  expect(tree.toJSON()).toBeTruthy();
});
