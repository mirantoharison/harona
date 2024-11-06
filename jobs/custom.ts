import { initBrowser } from '@lib/puppeteer';
import { Page, ElementHandle } from 'puppeteer';
import Datastore from 'nedb-promises';

//const url = 'https://maps.app.goo.gl/b1NnHQvDeo7pzdFg9';
const url='https://www.welcometothejungle.com/fr';
(async () => {
  try {
    const browser = await initBrowser(30000);
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForNetworkIdle();
    
    const selectorDb = Datastore.create('selector.db');
    const actionDb = Datastore.create('action.db');
    const actionList = await _getActionListFromDB(actionDb);
    
    const result = {};
    for(const action of actionList){
      console.log('Perform operation :', action.name);
      
      // make sure that the browser has 
      await page.waitForNetworkIdle();
      
      let selectorList, selectorTree, selectorTreeHandle, handle;

      // Common logic for building selector tree and handle
      const _common_build = async (selectorDb, selectorId, page: Page) => {
        selectorList = await _getTargetSelectorFromId(selectorDb, selectorId);
        selectorTree = await _buildSelectorTree(selectorList);
        selectorTreeHandle = await _buildSelectorTreeHandle(selectorTree, page);
        return selectorTreeHandle;
      };
    
      if (['group', 'scrap'].includes(action.action)) {
        // Build selector tree data for 'group' or 'scrap'
        selectorList = await _buildSelectorTreeForAction(selectorDb, action.selectorId);
        selectorTree = await _buildSelectorTree(selectorList, action.selectorId);
        selectorTreeHandle = await _buildSelectorTreeHandle(selectorTree, page);
        const selectorTreeData = await _buildSelectorTreeData(selectorTreeHandle);
        result[action.name] = { ...selectorTreeData };
      } 
      else if (action.action === 'click') {
        // Click action logic
        selectorTreeHandle = await _common_build(selectorDb, action.selectorId, page);
        handle = Object.values(selectorTreeHandle)[0];
        if (Array.isArray(handle)) {
          for (const element of handle) {
            await _setActionForHandle(page, element, action);
          }
        } else {
          await _setActionForHandle(page, handle, action);
        }
      } 
      else if (action.action === 'scrollToAndWait') {
        // ScrollToAndWait action logic
        selectorTreeHandle = await _common_build(selectorDb, action.selectorId, page);
        if (action.timeoutType === 'count' && action.objectId) {
          action.objectSelector = await _getTargetSelectorFromId(selectorDb, action.objectId);
        }
    
        handle = Object.values(selectorTreeHandle)[0];
        if (!Array.isArray(handle)) {
          await _setActionForHandle(page, handle, action);
        } else {
          console.error('Cannot perform scroll on multiple elements');
        }
      }
    }
    
    await page.screenshot({ path: 'screenshot.png' });
    console.log(result)
    
    
    /**
     * These are just snippets for data querying in puppeteer
     */
    /*
    const selectorList = await _getSelectorListFromDB(selectorDb);

    const selectorTree = await _buildSelectorTree(selectorList);
    const selectorTreeHandle = await _buildSelectorTreeHandle(selectorTree, page);
    const selectorTreeData = await _buildSelectorTreeData(selectorTreeHandle);
    console.log(JSON.stringify(selectorTreeData))
    */
    
    browser.close();
  } catch (err) {
    console.error(err);
  }
})();


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



async function _getActionListFromDB(datastore){
  return await datastore.find({}).sort({order: 1});
}

interface actionListProps{
  name: string;
  displayName: string;
  selectorId: string;
  order: number;
  action: string;
}
async function _buildActionSequence(page: Page, actionList: actionListProps[]){
  let selectorDb = Datastore.create('selector.db');
  let sequence = [];
  for(const action of actionList){
    //const parent = 
    const selector = await _getTargetSelectorFromId(selectorDb, action.selectorId);
    console.log(handle)
    /*const activity = await _setActionForHandle(page, handle, action);
    sequence.push(activity);*/
  }
  return sequence;
}

async function _buildSelectorTreeForAction(datastore, actionId: string){
  const result = [];
  const selectors = await _getChildSelectorFromParentId(datastore, actionId);
  result.push(...selectors);
  
  for(const selector of selectors){
    result.push(...(await _getChildSelectorFromParentId(datastore, selector._id)));
  }
  
  return result;
}

enum scrollEndType{
  count = "count",
  second = "second"
}
interface actionPropsCount {
  action: string;
  ending: scrollEndType.count;
  objectToCount?: string; 
  endingCount?: number;
  endingSecond?: never;
}
interface actionPropsSecond {
  action: string;
  ending: scrollEndType.second;  // When ending is 'second'
  endingSecond: number;          // endingSecond is required
  endingCount?: never;           // endingCount is not allowed
}
async function _setActionForHandle(page: Page, handle: ElementHandle | object, props: actionPropsCount | actionPropsSecond){
  const _handleClick = async (page, handle) => {
    await handle.click();
    await page.waitForNetworkIdle();
    return;
  }
  
  interface scrollProps{
    timeoutMs: number;
    loopLimit?: number;
  }
  const _handleScroll = async (page, handle) => {
    await handle.scrollIntoView();
    await page.waitForNetworkIdle();
    return;
  }
  
  const _handleScrollAndWait = async (page, handle, props: scrollProps) => {
    let startTime = Date.now();
    let lastCount = 0;
    
    let timeoutMs = props.timeoutMs ?? 10000;
    
    while (
      Date.now() - startTime < timeoutMs
    ) {
      if(
        props.timeoutType === 'count' && 
        props.objectSelector.length > 0 &&
        props.objectSelector[0] &&
        props.objectSelector[0].array
      ){
        const handles = await _getSelectorHandle(page, props.objectSelector[0].selector, props.objectSelector[0]);
        const count = handles.length;
        await _handleScroll(page, handle.handle);
        if (count > lastCount) lastCount = count;
        const result = count > lastCount;
        const handleContent = await _getSelectorData(handle.handle, handle);
        
        if (result || (typeof handleContent === 'string' && handleContent === '')) return true;
        else startTime = Date.now();
      }

      await sleep(100);
    }
    
    return false;
  }
  
  if(props.action === "click") return await _handleClick(page, handle);
  else if(props.action === "scrollTo") return await _handleScroll(page, handle);
  else if(props.action === "scrollToAndWait") return await _handleScrollAndWait(page, handle, props);
  return;
}



async function _getTargetSelectorFromId(datastore, id: string){
  return await datastore.find({_id: id});
}

async function _getChildSelectorFromParentId(datastore, parentId: string){
  return await datastore.find({parentId});
}

async function _buildSelectorTree(selectors: object[], parentId?: string) {
  const roots = selectors.filter((selector) => selector.parentId === parentId);
  for (const root of roots) {
    root.children = await _buildSelectorTree(selectors, root._id);
    if (root.children.length === 0) delete root.children;
  }
  return roots;
}

async function _buildSelectorTreeHandle(blocks: object[] | object, parent) {
  let tree = {};
  let handles;
  let keys = ['text', 'html', 'splitText', 'attrText'];

  blocks = Array.isArray(blocks) ? blocks : [blocks];

  for (const block of blocks) {
    handles = block.selector ? await _getSelectorHandle(parent, block.selector, block) : [parent];
    if (block.children) {
      handles = await Promise.all(
        handles.map(async (handle) => {
          let branch = {};
          for (const child of block.children) {
            branch = Object.assign(branch, await _buildSelectorTreeHandle(child, handle));
          }
          return branch;
        })
      );
    }
    
    const treeObject = {};
    for(const key of Object.keys(block)) {
      if(keys.includes(key)) treeObject[key] = block[key];
    }
    tree[block.name] = Object.keys(treeObject).length > 0 ? Object.assign(treeObject, {handle: handles}) : handles;
  }

  return tree;
}

async function _buildSelectorTreeData(trees: object) {
  for(const key of Object.keys(trees)){
    if(Array.isArray(trees[key])){
      trees[key] = await Promise.all(trees[key].map(branch => _buildSelectorTreeData(branch)));   
    }
    else{
      trees[key] = trees[key].return === false ? trees[key] : await _getSelectorData(trees[key].handle, trees[key]);
    }
  }
  return trees;
}

interface selectorHandleProps {
  array?: boolean;
}
async function _getSelectorHandle(parent: any, selector: string, property: selectorHandleProps) {
  let handle;
  if (property.array) handle = await parent?.$$(selector);
  else handle = await parent?.$(selector);
  return handle;
}

interface selectorDataProps {
  text?: boolean;
  html?: boolean;
  splitText?: string;
  attrText?: string;
}
async function _getSelectorData(handle: any, property: selectorDataProps) {
  const _getData = async (handle, property: selectorDataProps) => {
    if (property.text) {
      return await handle?.evaluate((el) => el.textContent);
    } else if (property.html) {
      return await handle?.evaluate((el) => el.innerHTML);
    } else if (property.splitText) {
      return await handle?.evaluate((el, property) => el.textContent.split(property.splitText), property);
    } else if (property.attrText) {
      return await handle?.evaluate((el, property) => el.getAttribute(property.attrText), property);
    }
    return null;
  };

  if (Array.isArray(handle)) {
    return await Promise.all(handle.map((el) => _getData(el, property)));
  } else {
    return await _getData(handle, property);
  }
}
