import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryArticles (params: object) {
  return request(`articles?${stringify(params)}`);
}

export async function queryAllTags () {
  return request('tags/all');
}
