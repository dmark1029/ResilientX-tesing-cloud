<template>
  <div>
    <div class="columns is-hidden-mobile mb-0">
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          class="spart-component"
          :project="project"
          :collection="collection"
          url="/widget/assets-count"
          title="Assets"
          color="#6f0b11"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          class="spart-component"
          :project="project"
          :collection="collection"
          url="/widget/assets-count?type=domain"
          title="Domains"
          color="#073294"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          class="spart-component"
          :project="project"
          :collection="collection"
          url="/widget/assets-count?type=subdomain"
          title="Subdomains"
          color="#8806ba"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          class="spart-component"
          :project="project"
          :collection="collection"
          url="/widget/assets-count?type=ipv4"
          title="Addresses"
          color="#05a2ba"
        />
      </div>
    </div>
    <div>
      <div v-if="!loading" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column pt-0 pb-0 is-flex">
              <VField>
                <VControl>
                  <div
                    class="is-flex is-justify-content-space-between is-align-items-center search-input mr-2"
                  >
                    <img src="/images/icons/navbar/search-normal.png" alt="search" />
                    <VInput
                      v-model="search"
                      type="text"
                      placeholder="Search here"
                      style="color: #c3c5d9"
                    >
                    </VInput>
                  </div>
                </VControl>
              </VField>
              <VField>
                <VControl
                  class="is-flex is-justify-content-space-between is-align-items-center"
                >
                  <div
                    class="is-flex is-justify-content-space-between is-align-items-center"
                  >
                    <v-menu
                      v-if="product"
                      ref="dropdown"
                      transition="slide-y-transition"
                      class="ml-0"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          class="text-none filter-button is-flex is-justify-content-space-between is-align-items-center"
                          density="compact"
                          size="large"
                          variant="text"
                          border
                          @click="toggleDropdown()"
                        >
                          <img
                            src="/images/icons/navbar/filter-search.png"
                            alt="search"
                          />
                          <span class="filter-text">Filter</span>
                        </v-btn>
                      </template>
                      <v-list class="filter-list">
                        <v-list-item>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Group</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedGroups.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item class="mb-2">
                                  <div
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-text-field
                                      v-model="searchGroups"
                                      placeholder="Search"
                                      class="search-options"
                                      @click.stop
                                      @keydown.space.stop
                                    >
                                      <img
                                        src="/images/icons/navbar/search-normal.png"
                                        alt="search"
                                        class="mr-2"
                                      />
                                    </v-text-field>
                                  </div>
                                </v-list-item>
                                <v-list-item
                                  v-if="filteredGroups.length === 0"
                                  @click.stop
                                >
                                  <v-list
                                    class="group-option is-flex is-align-items-center is-justify-content-center"
                                  >
                                    <p>The list is empty</p>
                                  </v-list>
                                </v-list-item>
                                <v-list-item
                                  v-for="(item, index) in filteredGroups"
                                  v-else
                                  :key="index"
                                  @click.stop
                                >
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedGroups"
                                      :label="item.name"
                                      :value="item.id"
                                      class="is-flex is-align-items-center"
                                    >
                                    </v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Status</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedStatus.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item @click.stop>
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedStatus"
                                      label="Active"
                                      value="active"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click.stop>
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedStatus"
                                      label="Archive"
                                      value="disabled"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click.stop>
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedStatus"
                                      label="Favorite"
                                      value="favorite"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Type</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedType.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item
                                  v-for="(each, key) in general.assets.types"
                                  :key="key"
                                  @click.stop
                                >
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedType"
                                      :label="each"
                                      :value="key"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Business Impact</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedBusinessImpacts.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item
                                  v-for="(each, key) in general.assets.impacts"
                                  :key="key"
                                  @click.stop
                                >
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                    @click.stop
                                  >
                                    <v-checkbox
                                      v-model="selectedBusinessImpacts"
                                      :label="each"
                                      :value="each"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Risk Rating</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedRisks.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item
                                  v-for="(each, key) in general.assets.impact_risks"
                                  :key="key"
                                  @click.stop
                                >
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedRisks"
                                      :label="each"
                                      :value="each"
                                      class="is-flex is-align-items-center"
                                    ></v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Tags</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedTags.length }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-list-item v-if="filteredTags.length === 0" @click.stop>
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center is-justify-content-center"
                                  >
                                    <p>The list is empty</p>
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  v-for="(item, index) in filteredTags"
                                  v-else
                                  :key="index"
                                  @click.stop
                                >
                                  <v-list-item-title
                                    class="second-option is-flex is-align-items-center"
                                  >
                                    <v-checkbox
                                      v-model="selectedTags"
                                      :label="item.name"
                                      :value="item.id"
                                      class="is-flex is-align-items-center"
                                    >
                                    </v-checkbox>
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Exposure Score</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span class="ml-1">{{ selectedValue }}</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <div
                                  class="is-flex is-align-items-center is-justify-content-center"
                                >
                                  <v-text-field
                                    v-model="exposureScoreValue[0]"
                                    class="exposure-min mx-2 mt-4"
                                    color="primary"
                                    label="Min"
                                    type="number"
                                    variant="outlined"
                                    :min="minValue"
                                    :max="maxValue"
                                    density="compact"
                                    @click.stop
                                    @focus="isFocused = true"
                                    @blur="isFocused = false"
                                  >
                                    <i v-if="isFocused" class="fa fa-percent"></i>
                                  </v-text-field>
                                  <v-text-field
                                    v-model="exposureScoreValue[1]"
                                    class="exposure-max mx-2 mt-4"
                                    color="primary"
                                    variant="outlined"
                                    :min="minValue"
                                    :max="maxValue"
                                    label="Max"
                                    type="number"
                                    density="compact"
                                    @click.stop
                                    @focus="isFocused = true"
                                    @blur="isFocused = false"
                                  >
                                    <i v-if="isFocused" class="fa fa-percent"></i>
                                  </v-text-field>
                                </div>
                                <div
                                  class="range-slider is-flex is-align-items-center is-justify-content-center"
                                >
                                  <v-range-slider
                                    v-model="exposureScoreValue"
                                    class="slider-bar"
                                    :max="100"
                                    :min="0"
                                    :step="1"
                                    hide-details
                                    thumb-label="always"
                                    @click.stop
                                  >
                                  </v-range-slider>
                                </div>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                          <v-list-item-title>
                            <v-menu
                              ref="dropdown"
                              transition="slide-y-transition"
                              class="ml-0"
                              location="end"
                            >
                              <template #activator="{ props }">
                                <v-btn v-bind="props" class="filter-first-button">
                                  <div
                                    class="first-option is-flex is-justify-content-space-between is-align-items-center"
                                  >
                                    <span>Scanning Status</span>
                                    <span
                                      class="is-flex is-justify-content-center is-align-items-center"
                                    >
                                      <span>{{ selectedScanningStatus ? 1 : 0 }}</span>
                                      <span class="ml-1">selected</span>
                                      <img
                                        src="/images/icons/navbar/vuesax_linear_arrow-right.svg"
                                        alt="arrow-right"
                                      />
                                    </span>
                                  </div>
                                </v-btn>
                              </template>
                              <v-list class="second-menu">
                                <v-radio-group v-model="selectedScanningStatus">
                                  <v-list-item @click.stop>
                                    <v-list-item-title
                                      class="second-option is-flex is-align-items-center"
                                    >
                                      <v-radio
                                        label="Yes"
                                        value="Yes"
                                        class="is-flex is-align-items-center"
                                      ></v-radio>
                                    </v-list-item-title>
                                  </v-list-item>
                                  <v-list-item @click.stop>
                                    <v-list-item-title
                                      class="second-option is-flex is-align-items-center"
                                    >
                                      <v-radio
                                        label="No"
                                        value="No"
                                        class="is-flex is-align-items-center"
                                      ></v-radio>
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-radio-group>
                              </v-list>
                            </v-menu>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div
                    class="is-flex is-justify-content-center is-align-items-center table-tool"
                  >
                    <v-menu
                      ref="dropdown"
                      transition="slide-y-transition"
                      class="ml-0"
                      location="bottom"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          density="compact"
                          size="large"
                          v-bind="props"
                          @click="selectButton(0)"
                        >
                          <img src="/images/icons/navbar/setting.png" alt="setting" />
                        </v-btn>
                      </template>
                      <v-list class="second-menu column-list">
                        <v-list-item>
                          <v-list-item-title
                            class="second-option is-flex is-align-items-center is-justify-content-center visibility"
                          >
                            <img src="/images/icons/navbar/setting.png" alt="setting" />
                            <span>Column Visibility</span>
                          </v-list-item-title>
                        </v-list-item>
                        <hr class="dropdown-divider" />
                        <v-list-item
                          v-for="(isSelected, label) in columns"
                          :key="label"
                          @click.stop="toggleSelection(label)"
                        >
                          <v-list-item-title
                            class="second-option is-flex is-align-items-center"
                          >
                            <v-checkbox
                              v-model="columns[label]"
                              :label="label"
                              class="is-flex is-align-items-center"
                            ></v-checkbox>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-btn
                      v-for="(button, index) in tableFilterButtons"
                      :key="index"
                      :style="toggleButtonStyle"
                      density="compact"
                      size="large"
                      @click="selectButton(index)"
                    >
                      <img :src="button.src" :alt="button.alt" />
                    </v-btn>
                  </div>
                </VControl>
              </VField>
              <div class="filter-part">
                <v-chip
                  v-if="selectedGroups.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedGroups = []"
                  @click="toggleGroup"
                >
                  <span class="chip-detail mr-2">{{ selectedGroups.length }}</span>
                  <span class="chip-detail">Group</span>
                  <v-menu
                    ref="dropdown"
                    v-model="groupVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedGroups.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                      >
                        <span class="chip-detail mr-2">{{ selectedGroups.length }}</span>
                        <span class="chip-detail">Group</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item @click.stop>
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center mb-2"
                        >
                          <v-text-field
                            v-model="searchGroups"
                            placeholder="Search"
                            class="search-options"
                          >
                            <img
                              src="/images/icons/navbar/search-normal.png"
                              alt="search"
                              class="mr-2"
                            />
                          </v-text-field>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-for="(item, index) in filteredGroups"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedGroups"
                            :label="item.name"
                            :value="item.id"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- status -->

                <v-chip
                  v-if="selectedStatus.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedStatus = []"
                  @click="toggleStatus"
                >
                  <span class="chip-detail mr-2">{{ selectedStatus.length }}</span>
                  <span class="chip-detail">Status</span>
                  <v-menu
                    ref="dropdown"
                    v-model="statusVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedStatus.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                      >
                        <span class="chip-detail mr-2">{{ selectedStatus.length }}</span>
                        <span class="chip-detail">Group</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item
                        v-for="(item, index) in filteredStatus"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedStatus"
                            :label="item.label"
                            :value="item.value"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Type -->

                <v-chip
                  v-if="selectedType.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedType = []"
                  @click="toggleType"
                >
                  <span class="chip-detail mr-2">{{ selectedType.length }}</span>
                  <span class="chip-detail">Type</span>
                  <v-menu
                    ref="dropdown"
                    v-model="typeVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedType.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                      >
                        <span class="chip-detail mr-2">{{ selectedType.length }}</span>
                        <span class="chip-detail">Type</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item
                        v-for="(item, index) in filteredType"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedType"
                            :label="item.label"
                            :value="item.value"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Business Impact -->

                <v-chip
                  v-if="selectedBusinessImpacts.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedBusinessImpacts = []"
                  @click="toggleBusinessImpact"
                >
                  <span class="chip-detail mr-2">{{
                    selectedBusinessImpacts.length
                  }}</span>
                  <span class="chip-detail">Business Impact</span>
                  <v-menu
                    ref="dropdown"
                    v-model="businessImpactVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedBusinessImpacts.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                      >
                        <span class="chip-detail mr-2">{{
                          selectedBusinessImpacts.length
                        }}</span>
                        <span class="chip-detail">Business Impact</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item
                        v-for="(item, index) in filteredBusinessImpacts"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedBusinessImpacts"
                            :label="item.label"
                            :value="item.value"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Risk -->

                <v-chip
                  v-if="selectedRisks.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedRisks = []"
                  @click="toggleRisk"
                >
                  <span class="chip-detail mr-2">{{ selectedRisks.length }}</span>
                  <span class="chip-detail">Risk Rating</span>
                  <v-menu
                    ref="dropdown"
                    v-model="riskVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedRisks.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        style="right: 40px"
                        closable
                      >
                        <span class="chip-detail mr-2">{{ selectedRisks.length }}</span>
                        <span class="chip-detail">Risk</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item
                        v-for="(item, index) in filteredRisks"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedRisks"
                            :label="item.label"
                            :value="item.value"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Tag -->

                <v-chip
                  v-if="selectedTags.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedTags = []"
                  @click="toggleTag"
                >
                  <span class="chip-detail mr-2">{{ selectedTags.length }}</span>
                  <span class="chip-detail">Tags</span>
                  <v-menu
                    ref="dropdown"
                    v-model="tagVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedTags.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                      >
                        <span class="chip-detail mr-2">{{ selectedTags.length }}</span>
                        <span class="chip-detail">Risk</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-list-item
                        v-for="(item, index) in filteredTags"
                        :key="index"
                        @click.stop
                      >
                        <v-list-item-title
                          class="second-option is-flex is-align-items-center"
                        >
                          <v-checkbox
                            v-model="selectedTags"
                            :label="item.name"
                            :value="item.id"
                            class="is-flex is-align-items-center"
                          ></v-checkbox>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Exposure score -->

                <v-chip
                  v-if="selectedValue === 'selected'"
                  class="group-chip relative"
                  closable
                  @click:close="exposureScoreValue = [0, 100]"
                  @click="toggleExposureScore"
                >
                  <span class="chip-detail mr-2">Exposure Score</span>
                  <span class="chip-detail mr-2">{{ exposureScoreValue[0] }}%</span>
                  <span class="chip-detail mr-2">~</span>
                  <span class="chip-detail mr-2">{{ exposureScoreValue[1] }}%</span>
                  <v-menu
                    ref="dropdown"
                    v-model="exposureScoreVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedValue"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                        style="right: 80px"
                      >
                        <span class="chip-detail mr-2">{{
                          selectedScanningStatus.length
                        }}</span>
                        <span class="chip-detail">Exposure score</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <div
                        class="is-flex is-align-items-center is-justify-content-center"
                      >
                        <v-text-field
                          v-model="exposureScoreValue[0]"
                          class="exposure-min mx-2 mt-4"
                          color="primary"
                          label="Min"
                          type="number"
                          variant="outlined"
                          :min="minValue"
                          :max="maxValue"
                          density="compact"
                          @click.stop
                          @focus="isFocused = true"
                          @blur="isFocused = false"
                        >
                          <i v-if="isFocused" class="fa fa-percent"></i>
                        </v-text-field>
                        <v-text-field
                          v-model="exposureScoreValue[1]"
                          class="exposure-max mx-2 mt-4"
                          color="primary"
                          variant="outlined"
                          :min="minValue"
                          :max="maxValue"
                          label="Max"
                          type="number"
                          density="compact"
                          @click.stop
                          @focus="isFocused = true"
                          @blur="isFocused = false"
                        >
                          <i v-if="isFocused" class="fa fa-percent"></i>
                        </v-text-field>
                      </div>
                      <div
                        class="range-slider is-flex is-align-items-center is-justify-content-center"
                      >
                        <v-range-slider
                          v-model="exposureScoreValue"
                          class="slider-bar"
                          :max="100"
                          :min="0"
                          :step="1"
                          hide-details
                          thumb-label="always"
                          @click.stop
                        >
                        </v-range-slider>
                      </div>
                    </v-list>
                  </v-menu>
                </v-chip>

                <!-- Scanning status -->

                <v-chip
                  v-if="selectedScanningStatus.length > 0"
                  class="group-chip relative"
                  closable
                  @click:close="selectedScanningStatus = ''"
                  @click="toggleScanningStatus"
                >
                  <span class="chip-detail mr-2">{{
                    selectedScanningStatus ? 1 : 0
                  }}</span>
                  <span class="chip-detail">Scanning Status</span>
                  <v-menu
                    ref="dropdown"
                    v-model="scanningStatusVisible"
                    transition="slide-y-transition"
                    class="ml-0"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-chip
                        v-if="selectedScanningStatus.length > 0"
                        v-bind="props"
                        class="group-chip invisible"
                        closable
                        style="right: 80px"
                      >
                        <span class="chip-detail mr-2">{{
                          selectedScanningStatus.length
                        }}</span>
                        <span class="chip-detail">Risk</span>
                      </v-chip>
                    </template>
                    <v-list class="second-menu mt-2">
                      <v-radio-group v-model="selectedScanningStatus">
                        <v-list-item @click.stop>
                          <v-list-item-title
                            class="second-option is-flex is-align-items-center"
                          >
                            <v-radio
                              label="Yes"
                              value="Yes"
                              class="is-flex is-align-items-center"
                            ></v-radio>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.stop>
                          <v-list-item-title
                            class="second-option is-flex is-align-items-center"
                          >
                            <v-radio
                              label="No"
                              value="No"
                              class="is-flex is-align-items-center"
                            ></v-radio>
                          </v-list-item-title>
                        </v-list-item>
                      </v-radio-group>
                    </v-list>
                  </v-menu>
                </v-chip>

                <v-chip
                  v-if="isFiltering"
                  class="group-chip"
                  closable
                  @click:close="clearFilter"
                  @click="clearFilter"
                >
                  <span class="chip-detail">Clear all</span>
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canPerformAction('assets', 'create')" class="buttons">
          <span v-if="project" class="add-asset-btn">
            <v-btn prepend-icon="mdi-plus" size="small" @click="showModal = true">
              <template #prepend>
                <v-icon size="large"></v-icon>
              </template>
              <span>Add an asset</span>
            </v-btn>
          </span>
          <span v-else class="add-asset-btn">
            <v-btn class="disabled" prepend-icon="mdi-plus" color="primary" raised>
              <template #prepend>
                <v-icon size="x-large"></v-icon>
              </template>
              <span>Add an asset</span>
            </v-btn>
          </span>
        </div>
      </div>

      <div v-if="toggleCaret" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column pt-0 pb-0 is-align-items-center">
              <div class="field">
                <label class="label is-flex">
                  <span>
                    <span>Exposure Score</span>&nbsp;
                    <span>[{{ exposureScoreValue[0] }},</span>
                    <span>{{ exposureScoreValue[1] }}]</span>
                  </span>
                </label>
                <div
                  class="is-flex is-justify-content-center is-align-items-center columns mx-0 mt-1"
                >
                  <VField class="has-rounded-tooltip w-100">
                    <VControl>
                      <Slider
                        v-model="exposureScoreValue"
                        :min="0"
                        :max="100"
                        :step="1"
                        :tooltips="false"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="isScanned"
                    :attrs="{ id }"
                    :options="{
                      1: 'Yes',
                      0: 'No',
                    }"
                    placeholder="Has been scanned"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
          </div>
        </div>
      </div>

      <div v-if="loading || !projectAssets" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <NoData :meta="projectAssets?.meta" :search="search" />

        <TransitionGroup name="list" tag="div">
          <div v-if="projectAssets?.meta?.total" class="datatable-container asset-table">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr style="box-shadow: 0 4px #11131c">
                  <td style="max-width: 50px; width: 50px; min-width: 50px">
                    <label
                      :class="bulkActionLoading ? 'checkbox is-disabled' : 'checkbox'"
                    >
                      <input
                        v-model="bulkChecked"
                        type="checkbox"
                        :disabled="bulkActionLoading"
                        @change="toggleBulkCheckAll()"
                      />
                      <span class="tick" />
                    </label>
                  </td>
                  <TableSortableHeader
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Asset"
                    slug="asset"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Name']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Name"
                    slug="name"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Project'] && !project"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Project"
                    slug="project"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Exposure score']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Exposure Score"
                    slug="exposure_score"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Business impact']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Businesss Impact"
                    slug="business_impact"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Risk rating']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Risk rating"
                    slug="business_impact_risk"
                    @changeSort="changeSort"
                  />
                  <th
                    v-if="columns['Groups'] && !collection"
                    style="vertical-align: middle"
                  >
                    Groups
                  </th>
                  <TableSortableHeader
                    v-if="columns['Status']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Type']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Type"
                    slug="type"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Scanned']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Scanned"
                    slug="scanned_date"
                    @changeSort="changeSort"
                  />
                  <th v-if="columns['Tags']" style="vertical-align: middle">Tags</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr style="height: 4px"></tr>
                <tr
                  v-for="item in projectAssets.data"
                  :key="item.id"
                  class="is-clickable"
                  @click="goToAsset(item)"
                >
                  <td style="max-width: 50px; width: 50px; min-width: 50px" @click.stop>
                    <label
                      :class="bulkActionLoading ? 'checkbox is-disabled' : 'checkbox'"
                    >
                      <input
                        v-model="bulkCheck"
                        :value="item.id"
                        type="checkbox"
                        :disabled="bulkActionLoading"
                        @change="saveItem(item)"
                      />
                      <span class="tick" />
                    </label>
                  </td>
                  <td>
                    <a
                      :href="'http://' + item.value"
                      target="_blank"
                      @click.stop.prevent="openLink(item.value)"
                      ><i class="fa fa-external-link-alt mr-1"
                    /></a>
                    {{ item.value }}
                    <span v-if="item.private_network" class="ml-1">
                      <span class="tag is-small is-capitalized">Private network</span>
                    </span>
                  </td>
                  <td v-if="columns['Name']">
                    {{ item.name }}
                  </td>
                  <td v-if="columns['Project'] && !project">
                    {{ resolveProject(item.project_id)?.name }}
                  </td>
                  <td v-if="columns['Exposure score']">
                    <AssetExposureScoreBadge
                      v-if="item.exposure_score !== null"
                      :previous-score="item.previous_exposure_score"
                      :score="item.exposure_score"
                      class="mr-2"
                    />
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Business impact']">
                    <v-chip class="business-impact" variant="outlined">
                      {{ item.business_impact }}
                    </v-chip>
                  </td>
                  <td v-if="columns['Risk rating']">
                    <BusinessImpactRiskBadge :impact="item.business_impact_risk" />
                  </td>
                  <td v-if="columns['Groups'] && !collection">
                    <span v-if="item.collections.length">
                      <router-link
                        v-for="collection in item.collections"
                        :key="collection"
                        :to="{
                          name: 'ProjectCollectionView',
                          params: {
                            id: collection.project_id,
                            collection: collection.id,
                          },
                        }"
                        class="mr-2"
                        @click.stop.prevent=""
                        >{{ collection.name }}</router-link
                      >
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Status']">
                    <v-btn
                      class="text-none active-status"
                      rounded="0"
                      variant="outlined"
                      prepend-icon="mdi-check-circle"
                      :class="
                        canPerformAction('assets', 'update')
                          ? 'is-clickable'
                          : 'is-disabled'
                      "
                      @click.stop.prevent="toggleArchive([item])"
                    >
                      <template #prepend>
                        <v-icon></v-icon>
                      </template>
                      <span v-if="item.status === 'active'">Active</span>
                      <span v-else>Archived</span>
                    </v-btn>
                  </td>
                  <td v-if="columns['Type']">
                    {{ item.type_text }}
                  </td>
                  <td v-if="columns['Scanned']">
                    {{ item.scanned_date_text }}
                  </td>
                  <td v-if="columns['Tags']">
                    <span v-if="item.tags.length">
                      <!-- <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="tag is-primary mr-2"
                        >{{ tag }}</span
                      > -->
                      <v-chip
                        v-for="tag in item.tags"
                        :key="tag"
                        class="asset-tag mr-1"
                        variant="outlined"
                      >
                        {{ tag }}
                      </v-chip>
                    </span>
                    <span v-else> - </span>
                  </td>
                  <td class="text-end">
                    <!-- <router-link :to="getAssetViewURL(item)" @click.stop.prevent="" style="padding: 0 6px;">
                      <img src="/images/icons/navbar/eye.png" alt="eye" />
                    </router-link> -->
                    <v-tooltip text="View asset" location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          density="compact"
                          size="large"
                          style="padding: 0 6px; box-shadow: none !important"
                          @click.stop.prevent="navigateToAsset(item)"
                        >
                          <img src="/images/icons/navbar/eye.png" alt="eye" />
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Launch scans" location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          density="compact"
                          size="large"
                          style="padding: 0 6px; box-shadow: none !important"
                          @click.stop.prevent="scanNow(item)"
                        >
                          <img src="/images/icons/navbar/scan.png" alt="scan" />
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Edit asset" location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          density="compact"
                          size="large"
                          style="padding: 0 6px; box-shadow: none !important"
                          @click.stop.prevent="editAsset(item)"
                        >
                          <img src="/images/icons/navbar/edit.png" alt="edit" />
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="projectAssets"
          :per-page="limit"
          @pagination-change-page="getAssets"
          @per-page-change="
            (perPage) => {
              $store.dispatch('addLimit', perPage)
              getAssets()
            }
          "
        />

        <div>
          <AreYouSureModal ref="confirmDialogue" />
          <VModal is="div" :open="issueCloseLoading" title="Loading..." size="small">
            <template #content>
              <div class="app-init-wrapper">
                <VLoader :active="true">
                  <div />
                </VLoader>
              </div>
            </template>
          </VModal>
          <AreYouSureModal ref="issueConfirmDialogue" />
          <!-- <AssetsModal v-if="showModal" :editable="editable" :project="project" :collection="collection"
            @closeModal="hideModal" /> -->
          <NewAssetsModal
            v-if="showModal"
            :editable="editable"
            :project="project"
            :collection="collection"
            @closeModal="hideModal"
          />
          <!-- <ImportAssetsModal v-if="showImportModal" :project="project" @closeModal="hideModal" /> -->

          <TasksModal
            v-if="showScanNowModal"
            :asset="scanNowItem"
            :project="project"
            @close="onCloseScanModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/@src/axios'

import NewAssetsModal from '/@src/components/assets/NewAssetsModal.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import TasksModal from '../../components/tasks/TasksModal.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VControl from '/@src/components/base/form/VControl.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import Slider from '@vueform/slider'
import VInput from '/@src/components/base/form/VInput.vue'
import SparkStatsComponent from '/@src/components/modules/widgets/SparkStatsComponent.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import projectMixin from '/@src/mixins/projectMixin'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import { IssueStatus } from '/@src/models/enums'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    BusinessImpactRiskBadge,
    TableSortableHeader,
    SparkStatsComponent,
    VInput,
    Multiselect,
    Slider,
    VField,
    AssetExposureScoreBadge,
    Pagination,
    VLoader,
    NoData,
    VControl,
    TasksModal,
    AreYouSureModal,
    NewAssetsModal,
    VModal,
  },
  mixins: [permissionsMixin, urlMixin, projectMixin],
  props: ['project', 'workspace', 'type', 'collection'],
  data: () => ({
    showModal: false,
    loading: false,
    search: '',
    searchGroup: '',
    businessImpact: [],
    riskRating: [],
    searchTags: [],
    sort: '',
    perPage: '15',
    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    tags: [],
    tagsLoaded: null,
    countries: [],
    columns: {
      Name: false,
      Project: true,
      'Exposure score': true,
      'Business impact': true,
      'Risk rating': true,
      Groups: true,
      Status: true,
      Type: true,
      Scanned: true,
      Tags: true,
    },
    bulkCheck: [],
    bulkChecked: false,
    bulkAction: undefined,
    bulkActionLoading: false,
    issueCloseLoading: false,
    toggleCaret: false,
    isScanned: null,
    multiOptions: ['critical', 'high', 'medium', 'low'],
    exposureScoreValue: [0, 100],
    tableFilterButtons: [
      { src: '/images/icons/navbar/star.png', alt: 'Star' },
      { src: '/images/icons/navbar/archive-add.png', alt: 'Archive' },
    ],
    selectedButton: null,
    open: false,
    selectedGroups: [],
    selectedBusinessImpacts: [],
    selectedExposureScores: [],
    selectedType: [],
    selectedColumns: {},
    selectedStatus: ['active'],
    selectedRisks: [],
    selectedTags: [],
    selectedScanningStatus: '',
    searchGroups: '',
    groupItems: [],
    statusItems: [
      { label: 'Active', value: 'active' },
      { label: 'Archive', value: 'disabled' },
      { label: 'Favorite', value: 'favorite' },
    ],
    TypeItems: [
      { label: 'Domain', value: 'Domain' },
      { label: 'Subdomain', value: 'Subdomain' },
      { label: 'URL', value: 'URL' },
      { label: 'IPv4', value: 'IPv4' },
      { label: 'GCP cloud account', value: 'GCP cloud account' },
      { label: 'AWS cloud account', value: 'AWS cloud account' },
      { label: 'Azure cloud account', value: 'Azure cloud account' },
      { label: 'IPv4 range', value: 'IPv4 range' },
    ],
    BusinessImpactItems: [
      { label: 'Minimal', value: 'Minimal' },
      { label: 'Minor', value: 'Minor' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'Significant', value: 'Significant' },
      { label: 'Severe', value: 'Severe' },
    ],
    riskItems: [
      { label: 'Bad', value: 'Bad' },
      { label: 'Poor', value: 'Poor' },
      { label: 'Fair', value: 'Fair' },
      { label: 'Good', value: 'Good' },
      { label: 'Excellent', value: 'Excellent' },
    ],
    tagItems: [],
    groupVisible: false,
    statusVisible: false,
    typeVisible: false,
    businessImpactVisible: false,
    riskVisible: false,
    tagVisible: false,
    scanningStatusVisible: false,
    exposureScoreVisible: false,
    selectedRow: [],
    isFocused: false,
    minValue: 0,
    maxValue: 100,
    currentPage: 0,
  }),
  computed: {
    ...mapGetters([
      'projectAssets',
      'isMobile',
      'general',
      'module',
      'limit',
      'workspace',
      'project',
    ]),
    toggleButtonStyle() {
      return {
        opacity: this.bulkCheck.length !== 0 ? 1 : 0.5,
        cursor: this.bulkCheck.length !== 0 ? 'pointer' : 'not-allowed',
      }
    },
    chevronClass() {
      return this.toggleCaret ? 'fa fa-chevron-up' : 'fa fa-chevron-down'
    },
    isFiltering() {
      return (
        this.selectedGroups.length > 0 ||
        this.selectedStatus.length > 0 ||
        this.selectedType.length > 0 ||
        this.selectedBusinessImpacts.length > 0 ||
        this.selectedValue === 'selected' ||
        this.selectedRisks.length > 0 ||
        this.selectedTags.length > 0 ||
        this.selectedScanningStatus !== ''
      )
    },
    selectedValue() {
      return (this.exposureScoreValue[0] !== 0 && this.exposureScoreValue[0] !== '0') ||
        (this.exposureScoreValue[1] !== '100' && this.exposureScoreValue[1] !== 100)
        ? 'selected'
        : 'unselected'
    },
    filteredGroups() {
      const query = this.searchGroups.toLowerCase()
      return this.groupItems.filter((item) => item.name.toLowerCase().includes(query))
    },
    filteredStatus() {
      return this.statusItems.filter((item) => item.label.toLowerCase())
    },
    filteredType() {
      return this.TypeItems.filter((item) => item.label.toLowerCase())
    },
    filteredBusinessImpacts() {
      return this.BusinessImpactItems.filter((item) => item.label.toLowerCase())
    },
    filteredRisks() {
      return this.riskItems.filter((item) => item.label.toLowerCase())
    },
    filteredTags() {
      return this.tagItems.filter((item) => item.name.toLowerCase())
    },
  },
  watch: {
    search: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedGroups: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchType: _.debounce(function () {
      this.getAssets()
    }, 500),
    businessImpact: _.debounce(function () {
      this.getAssets()
    }, 500),
    riskRating: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedTags: _.debounce(function () {
      this.getAssets()
    }, 500),
    sort: _.debounce(function () {
      this.getAssets()
    }, 500),
    isScanned: _.debounce(function () {
      this.getAssets()
    }, 500),
    exposureScoreValue: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedScanningStatus: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedStatus: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedType: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedBusinessImpacts: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedRisks: _.debounce(function () {
      this.getAssets()
    }, 500),
    selectedValue(newValue) {
      this.handleSelectedValue()
    },
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addProjectAssets', null)

    if (this.$route.query.type) {
      this.searchType = this.$route.query.type
    }

    if (this.type) {
      this.searchType = this.type
    }

    if (this.collection) {
      this.searchGroup = this.collection.id
    }

    this.loadColumns()

    await Promise.all([this.getAssets()]).then(() => {
      this.loading = false
      if (this.project) {
        this.getTags()
      }
    })

    if (this.$route.query.open) {
      this.showModal = true
    }
  },
  methods: {
    toggleSelection(label) {
      this.columns[label] = !this.columns[label]
      this.updateValues(label)
    },
    handleSelectedValue() {
      this.isFocused = true
      this.getAssets()
    },
    updateValues(label) {
      localStorage.setItem('assets-table', JSON.stringify(this.columns))
      this.loadColumns()
    },
    saveItem(row) {
      const itemId = row.id
      const checked = this.bulkCheck.includes(itemId)
      if (checked) {
        const isExist = this.selectedRow.some((item) => item.id === row.id)
        if (!isExist) {
          this.selectedRow.push(row)
        }
      } else {
        this.selectedRow = this.selectedRow.filter((item) => item.id !== row.id)
      }
    },
    async toggleDropdown() {
      this.open = !this.open
      this.searchGroups = ''
      this.getTags()
      axios
        .get('/collection', {
          params: {
            id: this.project?.id,
            workspace_id: this.workspace?.id,
            q: '',
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item.id] = item.name
          })
          this.groupItems = Object.keys(groups).map((id) => ({
            id,
            name: groups[id],
          }))
        })
        .catch(() => {})
    },
    toggleGroup() {
      this.groupVisible = !this.groupVisible
    },
    toggleStatus() {
      this.statusVisible = !this.statusVisible
    },
    toggleType() {
      this.typeVisible = !this.typeVisible
    },
    toggleBusinessImpact() {
      this.businessImpactVisible = !this.businessImpactVisible
    },
    toggleRisk() {
      this.riskVisible = !this.riskVisible
    },
    toggleTag() {
      this.tagVisible = !this.tagVisible
    },
    toggleScanningStatus() {
      this.scanningStatusVisible = !this.scanningStatusVisible
    },
    toggleExposureScore() {
      this.exposureScoreVisible = !this.exposureScoreVisible
    },
    clearFilter() {
      this.selectedGroups = []
      this.selectedStatus = []
      this.selectedType = []
      this.selectedBusinessImpacts = []
      this.selectedRisks = []
      this.selectedTags = []
      this.selectedScanningStatus = ''
      this.exposureScoreValue = [0, 100]
    },

    showFilter() {
      this.toggleCaret = !this.toggleCaret
    },
    toggleBulkCheckAll() {
      if (this.bulkCheck.length === this.projectAssets.data.length) {
        this.bulkCheck = []
      } else {
        this.bulkCheck = this.projectAssets.data.map((item) => item.id)
      }
    },
    async selectButton(index) {
      if (this.bulkCheck.length === 0) {
        return
      }
      this.selectedButton = index
      if (index === 1) {
        await this.toggleArchive(this.selectedRow)
      } else if (index === 0) {
        await this.toggleFavorite(this.selectedRow)
        await this.getAssets()
      }

      this.selectedRow = []
      this.bulkCheck = []
      this.bulkChecked = false
    },
    async toggleFavorite(row) {
      const promises = row.map((each) => {
        return new Promise((resolve, reject) => {
          if (each.favorite) {
            axios
              .delete('/favorite/asset/' + each.favorite)
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          } else {
            axios
              .post('/favorite', {
                type: 'asset',
                id: each.id,
                workspace_id: this.workspace.id,
              })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          }
        })
      })

      return Promise.all(promises)
        .then(() => {})
        .catch(() => {})
    },
    async toggleArchive(row) {
      const ok = await this.$refs.confirmDialogue.show({
        title: 'Confirmation',
        message: 'Are you sure you want to toggle status of this item?', // here
        okButton: 'Yes',
        cancelButton: 'No',
      })

      if (ok) {
        const promises = row.map((each) => {
          return new Promise((resolve, reject) => {
            axios
              .post(`/asset/${each.id}?_method=PUT`, {
                business_impact: each.business_impact,
                status: each.status === 'disabled' ? 'active' : 'disabled',
                name: each.name,
              })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          })
        })

        return Promise.all(promises)
          .then(async () => {
            await this.getAssets()
          })
          .catch(() => {})
      }
    },
    openLink(url) {
      window.open('http://' + url, '_blank')
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('assets-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getAssets(page) {
      const currentPage = page || this.currentPage || 1
      this.currentPage = currentPage
      const isScanned =
        this.selectedScanningStatus === 'Yes'
          ? 1
          : this.selectedScanningStatus === 'No'
            ? 0
            : null
      return axios
        .get('/asset', {
          params: {
            id: this.project?.id,
            workspace_id: this.workspace?.id,
            q: this.search,
            collection_id: this.selectedGroups,
            priority: this.searchPriority,
            type: this.selectedType,
            filter: this.selectedStatus,
            tags: this.selectedTags,
            sort: this.sort,
            page: currentPage,
            limit: this.limit,
            is_scanned: isScanned,
            exposure_score_min: this.exposureScoreValue[0],
            exposure_score_max: this.exposureScoreValue[1],
            business_impact: this.selectedBusinessImpacts,
            business_impact_risk: this.selectedRisks,
          },
        })
        .then((res) => {
          this.$store.dispatch('addProjectAssets', res.data)
        })
        .catch(() => {})
    },
    getIssues(asset_id) {
      let url = `/issue`

      return axios
        .get(url, {
          params: {
            asset_id: asset_id,
            page: 1,
            q: this.search,
            status: IssueStatus.OPENED,
            module_id: '',
            issue_type_id: '',
            sort: this.sort,
            limit: this.limit,
          },
        })
        .then(async (res) => {
          const openedCount = res.data.data.filter(
            (element) => element.status !== IssueStatus.CLOSED
          ).length
          let ok = false
          if (openedCount !== 0) {
            ok = await this.$refs.issueConfirmDialogue.show({
              title: 'Confirmation',
              message: `There are ${openedCount} active issues. Do you want to close the issues?`,
              okButton: 'Confirm',
              cancelButton: 'Deny',
            })
          }
          if (ok) {
            this.issueCloseLoading = true
            for (const element of res.data.data) {
              if (element.status !== 'closed') {
                await this.closeStatus(element.id)
              }
              this.issueCloseLoading = false
            }
          }
        })
        .catch(() => {})
    },
    closeStatus(id) {
      return axios
        .put(`/issue/${id}`, {
          status: 'closed',
        })
        .then((res) => {})
        .catch(() => {})
    },
    goToAsset(item) {
      this.$router.push(this.getAssetViewURL(item))
    },
    getTags() {
      return axios
        .get('/tag/assets', {
          params: {
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
          },
        })
        .then((res) => {
          const tags = {}
          res.data.data.forEach((item) => {
            tags[item.id] = item.name
          })
          this.tagItems = Object.keys(tags).map((id) => ({
            id,
            name: tags[id],
          }))
        })
        .catch(() => {})
    },
    async hideModal(item) {
      this.showModal = false
      this.showImportModal = false
      this.editable = null
      await this.getAssets()
      if (this.project) {
        this.getTags()
      }
      if (item) {
        this.projectAssets.data.forEach((each) => {
          if (each.name === item.value) {
            this.goToAsset(each)
            return
          }
        })
      }
    },
    editAsset(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    scanNow(item) {
      this.showScanNowModal = true
      this.scanNowItem = item
    },
    navigateToAsset(item) {
      const url = this.getAssetViewURL(item)
      this.$router.push(url)
    },
    onCloseScanModal() {
      this.showScanNowModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
.spart-component {
  background: var(--dark-body-color);
}

.tile-grid-toolbar.assets {
  position: relative;
  background: var(--dark-body-color);
  padding: 12px 0;

  .add-asset-btn {
    button {
      height: 44px;
      border-radius: 100px;
      background: var(--dark-primary) !important;
      padding: 0 19.5px 0 15.6px;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      width: 153px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.43;
      letter-spacing: 0.1 !important;
      color: #fff;
      font-family: Poppins;
      text-transform: capitalize;
    }
    button.disabled {
      background: rgba(225, 225, 239, 0.12) !important;
    }
  }
}

.asset-filters {
  display: flex;
  align-self: center;
  min-width: 90%;

  .search-input,
  .filter-input {
    border-radius: 28px;
    border: 1px solid #434656;
    position: relative;

    img {
      left: 16px;
      position: absolute;
      width: 24px;
      height: 24px;
    }

    input {
      padding-left: 56px !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: 0.5px;
      text-align: left;
      color: #c3c5d9 !important;
      height: 44px !important;
      border: none !important;

      &::placeholder {
        font-family: Poppins;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: 0.5px;
        text-align: left;
        color: #c3c5d9 !important;
      }
      &:focus-visible {
        outline: none;
      }
    }
  }

  .filter-button {
    height: 48px;
    padding: 0 19.5px 0 15.5px !important;
    border: solid 1px var(--dark-border-color);
    border-radius: 100px;

    img {
      margin-right: 10px;
      width: 20px;
    }

    .filter-text {
      font-family: Poppins;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.13px;
      text-align: left;
      color: #b8c4ff;
    }
  }

  .search-input {
    width: 240px;
  }

  .filter-input {
    width: 101px;
    margin-right: 5px;

    img {
      width: 18px;
      height: 18px;
    }

    input {
      padding-left: 42px;
      font-family: Poppins;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.43;
      letter-spacing: 0.1px;
      text-align: center;
      color: #b8c4ff;
    }
  }

  .table-tool,
  .filter-part {
    margin-left: 10px;
    button {
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      padding: 0 5px;
    }

    .group-chip {
      border-radius: 8px !important;
      border: solid 1px var(--dark-border-color);
      height: 32px;
      margin: 1px 4px;

      .chip-detail {
        font-family: Poppins;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: normal;
        text-align: left;
        color: #c3c5d9;
      }
    }

    .group-chip.invisible {
      visibility: hidden;
      position: absolute;
      right: 0px;
    }
  }
  .filter-part {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
}

.filter-list {
  background: var(--sidebar-color) !important;
  width: 280px;

  .filter-first-button {
    padding: 0 !important;
    width: 100%;
    display: block;

    .first-option {
      width: 100%;
      height: 40px;
      padding: 8px 12px;

      &:hover {
        background: var(--dark-hover-color);
      }

      span {
        &:first-child {
          text-align: start;
          font-family: Poppins;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.43;
          letter-spacing: 0.25px;
          text-align: left;
          color: #e1e1ef;
          text-transform: none;
        }

        &:last-child {
          span {
            font-family: Poppins;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.67;
            letter-spacing: 0.5px;
            text-align: right;
            color: #c3c5d9;
            text-transform: none;
          }
        }
      }
    }
  }
}

.second-menu {
  width: 240px;
  background: var(--sidebar-color) !important;

  &.column-list {
    margin-top: 12px;
    height: 443px;
    width: 217px;

    .visibility {
      img {
        margin-right: 12px;
      }
      span {
        font-family: Poppins;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.25;
        letter-spacing: 0.25px;
        text-align: left;
        color: #e1e1ef;
      }
    }
    .dropdown-divider {
      height: 1px !important;
      background-color: #434656;
    }
  }

  .second-option {
    height: 40px;

    a {
      padding: 8px 12px;

      &:hover {
        background: var(--dark-hover-color);
      }
    }

    .v-checkbox {
      height: 100%;
    }

    .search-options {
      padding: 0 16px;
      border-radius: 20px !important;

      img {
        width: 18px;
        height: 18px;
      }
      &:hover {
        background: transparent !important;
      }
    }

    .v-list {
      background: transparent;
    }
  }
  .group-option {
    background: transparent;
  }
  .range-slider {
    margin-top: 50px;
  }
  .exposure-min,
  .exposure-max {
    i {
      position: absolute !important;
      right: 35px !important;
    }
  }
}

.asset-table {
  overflow: auto;

  tr {
    white-space: nowrap;
    background: var(--dark-table-color);
  }

  th {
    &:first-child {
      padding-left: 15px;
      position: sticky;
      left: 0;
      z-index: 3;
      background: inherit;
    }

    &:nth-child(2) {
      position: sticky;
      left: 50px;
      z-index: 3;
      background: inherit;
    }

    &:last-child {
      position: sticky;
      right: 0px;
      z-index: 3;
      background: inherit;
    }
  }

  td {
    &:first-child {
      padding-left: 15px;
      position: sticky;
      left: 0;
      z-index: 3;
      background: inherit;
    }

    &:nth-child(2) {
      position: sticky;
      left: 50px;
      z-index: 3;
      background: inherit;
    }

    &:last-child {
      position: sticky;
      right: 0px;
      z-index: 3;
      background: inherit;
      min-width: 108px !important;
    }

    &:last-child:hover {
      background: var(--dark-sidebar-light-9);
    }
    label {
      &:focus-visible {
        outline: none;
      }
      .tick {
        outline: none;
      }
    }
  }

  .text-end {
    button {
      background: transparent;
    }
  }

  .active-status {
    flex-grow: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 12px 0 6px;
    line-height: 2;
    font-family: Poppins;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    border-radius: 8px;
    border: solid 1px var(--dark-border-color);
    font-size: 12px;
    border-radius: 8px !important;
    height: 24px;

    .v-btn__prepend {
      margin-right: 6px !important;
    }

    .v-icon {
      margin-left: 4px;
    }
  }

  button {
    .v-btn__prepend {
      margin-right: 6px !important;
    }
  }

  .business-impact,
  .asset-tag {
    height: 24px !important;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #c3c5d9;
  }
}

.tile-grid-toolbar .control {
  margin-inline-end: 0px;
}

@media (width <=767px) {
  .asset-filters {
    min-width: 70%;
  }
}

.multi-range-slider-bar-only {
  width: 85% !important;
  padding: 0px !important;
}
</style>