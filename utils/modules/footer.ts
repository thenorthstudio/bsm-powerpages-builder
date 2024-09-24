import { Module } from "@/utils/moduleTypes";


export class FooterModule extends Module
{
  constructor() { super('footer') }
  createProps() { return {} }
  getDescriptor() { return this.getTitle() }
}
