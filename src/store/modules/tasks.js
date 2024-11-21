export default {
  state: {
    taskPageInterval: false,
    processing: false,
    processingCount: 0,
    processingOriginalCount: 0,
  },
  mutations: {
    setTaskPageInterval(state, interval) {
      state.taskPageInterval = interval;
    },
    setProcessing(state, processing) {
      state.processing = processing;
    },
    setProcessingCount(state, count) {
      state.processingCount = count;
    },
    setProcessingOriginalCount(state, count) {
      state.processingOriginalCount = count;
    },
  },
  actions: {
    addProcessing(context, { processing, count }) {
      context.commit('setProcessing', processing);
      context.commit('setProcessingCount', count);
      if (context.state.processingOriginalCount < count) {
        context.commit('setProcessingOriginalCount', count);
      }
    },
    addTaskPageInterval(context, interval) {
      context.commit('setTaskPageInterval', interval);
    }
  },
  getters: {
    processing(state) {
      return state.processing;
    },
    taskPageInterval(state) {
      return state.taskPageInterval;
    },
    processingCount(state) {
      return state.processingCount;
    },
    processingOriginalCount(state) {
      return state.processingOriginalCount;
    },
  },
};
