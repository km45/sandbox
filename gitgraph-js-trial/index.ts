import {createGitgraph, templateExtend, TemplateName} from '@gitgraph/js';

function generateMergeMessage(target: any, into: any): string {
  return 'Merge branch ' + target.name + ' into ' + into.name;
}

const graphContainer = document.getElementById('graph-container');

function branchNameToBranchesOrderPriority(branchName: string): number {
  const branchPrefix = branchName.split('/')[0];

  if (branchPrefix == 'main') {
    return 0;
  }
  if (branchPrefix == 'hotfix') {
    return 1;
  }
  if (branchPrefix == 'release') {
    return 2;
  }
  if (branchPrefix == 'develop') {
    return 3;
  }
  return 4;
}

const colorDefinition =
    ['#7dbf21', '#FB9CAE', '#BA6BB2', '#B2C173', '#3B96D8', '#E78400'];


const gitgraph = createGitgraph(graphContainer, {
  compareBranchesOrder: (branchNameA: string, branchNameB: string): number => {
    const priorityA = branchNameToBranchesOrderPriority(branchNameA);
    const priorityB = branchNameToBranchesOrderPriority(branchNameB);
    return priorityA - priorityB;
  },
  template: templateExtend(TemplateName.Metro, {
    colors: [
      // 0
      colorDefinition[branchNameToBranchesOrderPriority('main')],

      // 1
      colorDefinition[branchNameToBranchesOrderPriority('hotfix/b')],

      // 2
      colorDefinition[branchNameToBranchesOrderPriority('release/v1.0.0')],
      colorDefinition[branchNameToBranchesOrderPriority('release/v1.1.0')],
      colorDefinition[branchNameToBranchesOrderPriority('release/v1.1.1')],

      // 3
      colorDefinition[branchNameToBranchesOrderPriority('develop')],

      // 4
      colorDefinition[branchNameToBranchesOrderPriority('feature/fix-b')],
      colorDefinition[branchNameToBranchesOrderPriority('feature/c-refactor')],
      colorDefinition[branchNameToBranchesOrderPriority('feature/c-interface')],
      colorDefinition[branchNameToBranchesOrderPriority('feature/c-implement')],
      colorDefinition[branchNameToBranchesOrderPriority('feature/b')],
      colorDefinition[branchNameToBranchesOrderPriority('feature/a')],
    ],
    commit: {message: {displayAuthor: false, displayHash: false}}
  })
});

const main = gitgraph.branch('main').commit('Initial commit');
const develop = main.branch('develop').commit('...');

// feature A
const feature_a = develop.branch('feature/a').commit('Add feature A');
develop.merge(feature_a, generateMergeMessage(develop, feature_a));

// v1.0.0
const release_v1_0_0 = develop.branch('release/v1.0.0')
                           .commit('Bump version to 1.0.0')
                           .tag('v1.0.0');
develop.merge(release_v1_0_0, generateMergeMessage(release_v1_0_0, develop));
main.merge(release_v1_0_0, generateMergeMessage(release_v1_0_0, main));

// feature B
const feature_b = develop.branch('feature/b').commit('Add feature B');
develop.merge(feature_b, generateMergeMessage(develop, feature_b));

// v1.1.0
const release_v1_1_0 = develop.branch('release/v1.1.0')
                           .commit('Bump version to 1.1.0')
                           .tag('v1.1.0');
develop.merge(release_v1_1_0, generateMergeMessage(release_v1_1_0, develop));

// feature fix B
const feature_fix_b =
    develop.branch('feature/fix-b').commit('Fix bug of feature B');
develop.merge(feature_fix_b, generateMergeMessage(develop, feature_fix_b));

// v1.1.1
const release_v1_1_1 = develop.branch('release/v1.1.1')
                           .commit('Bump version to 1.1.1')
                           .tag('v1.1.1');
develop.merge(release_v1_1_1, generateMergeMessage(release_v1_1_1, develop));
main.merge(release_v1_1_1, generateMergeMessage(release_v1_1_1, main));

// hotfix B
const hotfix_b =
    main.branch('hotfix/b').commit('Fix bug of feature B').tag('v1.1.2');
main.merge(hotfix_b, generateMergeMessage(hotfix_b, main));
develop.merge(hotfix_b, generateMergeMessage(hotfix_b, develop));

// feature C
const feature_c_interface =
    develop.branch('feature/c-interface').commit('Add interface of feature C');
const feature_c_implement = feature_c_interface.branch('feature/c-implement')
                                .commit('Implement feature C');
const feature_c_refactor = feature_c_implement.branch('feature/c-refactor')
                               .commit('Refactor feature C');
develop.merge(
    feature_c_interface, generateMergeMessage(feature_c_interface, develop));
develop.merge(
    feature_c_implement, generateMergeMessage(feature_c_implement, develop));
develop.merge(
    feature_c_refactor, generateMergeMessage(feature_c_refactor, develop));
