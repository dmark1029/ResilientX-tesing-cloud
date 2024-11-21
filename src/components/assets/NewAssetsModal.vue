<template>
  <div class="text-center pa-4">
    <v-dialog
      v-if="!openCollectionModal"
      v-model="dialog"
      class="add-asset-modal"
      max-width="900"
      persistent
      @close="$emit('closeModal')"
    >
      <v-card class="columns">
        <div
          v-if="!addStatus"
          class="modal-header is-flex is-align-items-center is-justify-content-space-between"
        >
          <div
            class="is-flex is-align-items-end column is-one-quarter"
            :style="{ background: backgroundColor }"
          >
            <img
              src="/images/icons/navbar/vuesax_linear_arrow-left.svg"
              alt="back"
              @click="stepBack"
            />
            <p class="add-asset">{{ editable ? 'Edit' : 'Add a' }} Asset</p>
          </div>
          <div class="close-modal column is-three-quarters">
            <img
              src="/images/icons/navbar/vuesax_linear_close-circle.svg"
              alt="arrow-right"
              @click="$emit('closeModal')"
            />
          </div>
        </div>
        <div v-if="!addStatus" class="is-flex">
          <div class="modal-left column is-one-quarter is-flex">
            <transition name="fade-slow" mode="out-in">
              <div :key="step">
                <p v-if="step === 1" class="add-asset-description">
                  Quickly and easily add new assets to your account by following these
                  simple steps
                </p>
                <ul v-if="step === 2" class="select-mode-sidebar">
                  <li
                    :class="['mb-4', { selected: selectedMode === 'basic' }]"
                    @click="selectMode('basic')"
                  >
                    <p>Basic</p>
                  </li>
                  <li
                    :class="['mb-4', { selected: selectedMode === 'advanced' }]"
                    @click="selectMode('advanced')"
                  >
                    <p>Advanced</p>
                  </li>
                  <li
                    :class="['mb-4 is-disabled', { selected: selectedMode === 'import' }]"
                    @click="selectMode('import')"
                  >
                    <p>Import</p>
                  </li>
                </ul>
                <ul v-if="step === 3" class="select-mode-sidebar">
                  <li
                    :class="{ selected: selectedAsset === 'Domain' }"
                    @click="selectAsset('domain')"
                  >
                    <p>Domain</p>
                  </li>
                  <li
                    :class="{ selected: selectedAsset === 'Subdomain' }"
                    @click="selectAsset('subdomain')"
                  >
                    <p>Subdomain</p>
                  </li>
                  <li
                    :class="{ selected: selectedAsset === 'Url' }"
                    @click="selectAsset('url')"
                  >
                    <p>URL</p>
                  </li>
                  <li
                    :class="{ selected: selectedAsset === 'Ipv4' }"
                    @click="selectAsset('ipv4')"
                  >
                    <p>IPv4</p>
                  </li>
                  <li
                    :class="{ selected: selectedAsset === 'Ipv4-range' }"
                    @click="selectAsset('ipv4-range')"
                  >
                    <p>IPv4 range</p>
                  </li>
                </ul>
              </div>
            </transition>
            <div class="total-asset is-flex is-align-items-end is-justify-content-start">
              <img
                src="/images/icons/navbar/vuesax_bold_shield-security.svg"
                alt="total-asset"
                class="mr-2"
              />
              <span v-if="assetsLimit === 0" class="mr-2">Unlimited</span>
              <span v-else>
                <span class="mr-1">{{ assetsLimit }}</span>
                <span class="mr-1">/</span>
                <span class="mr-2">{{ assetsCount }}</span>
              </span>
              <span>Assets</span>
            </div>
          </div>
          <div class="modal-body column is-three-quarters">
            <div class="select-mode">
              <div
                class="is-flex is-align-items-center is-justify-content-center is-relative"
              >
                <VProgress
                  id="wizard-progress"
                  class="wizard-progress"
                  color="primary"
                  size="smaller"
                  style="position: absolute !important"
                  :value="((step - 1) / 3) * 100"
                  :max="100"
                />

                <VProgress
                  v-if="selectedMode === 'import' || selectedMode === 'basic'"
                  id="wizard-progress"
                  class="wizard-progress"
                  color="primary"
                  size="smaller"
                  style="position: absolute !important"
                  :value="((step - 1) / 2) * 100"
                  :max="100"
                />
              </div>
              <div class="select-body">
                <transition name="fade-slow" mode="out-in">
                  <div :key="step">
                    <div v-if="step === 1" class="select-description">
                      <p>Select Mode</p>
                      <p>
                        Select the mode for adding your asset. Each mode offers different
                        levels of detail and customization to suit your needs.
                      </p>
                    </div>

                    <div
                      v-if="step === 2 && selectedMode === 'advanced'"
                      class="select-asset-type-description"
                    >
                      <p>Select the asset type</p>
                      <p>
                        Select the asset type you want to add. Choose the one that best
                        fits your needs from the available options.
                      </p>
                    </div>

                    <div
                      v-if="step === 2 && selectedMode === 'basic'"
                      class="select-asset-type-description"
                    >
                      <p>Add assets</p>
                      <p>
                        Please enter each asset on a separate line. The system will
                        automatically detect the asset type and create it accordingly.
                      </p>
                    </div>

                    <div v-if="step === 3" class="asset-detail">
                      <p>Asset Details</p>
                      <p>
                        Provide comprehensive information about your asset by selecting
                        the appropriate group & entering relevant information.
                      </p>
                    </div>
                  </div>
                </transition>

                <transition name="fade-slow" mode="out-in">
                  <div :key="step">
                    <ul
                      v-if="step === 1"
                      class="asset-mode is-flex is-align-items-center is-justify-content-center"
                    >
                      <li
                        :class="[
                          'asset-mode-chip',
                          { selected: selectedMode === 'basic' },
                        ]"
                        @click="selectMode('basic')"
                      >
                        <div :class="['circle', { selected: selectedMode === 'basic' }]">
                          <v-icon v-if="selectedMode === 'basic'" icon="mdi-check" />
                        </div>
                        <div class="statement">
                          <p>Basic</p>
                          <ul class="mt-2">
                            <li>Add assets using a single input field.</li>
                            <li>Automatically detects the asset type.</li>
                          </ul>
                        </div>
                      </li>
                      <li
                        :class="[
                          'asset-mode-chip',
                          { selected: selectedMode === 'advanced' },
                        ]"
                        @click="selectMode('advanced')"
                      >
                        <div
                          :class="['circle', { selected: selectedMode === 'advanced' }]"
                        >
                          <v-icon v-if="selectedMode === 'advanced'" icon="mdi-check" />
                        </div>
                        <div class="statement">
                          <p>Advanced</p>
                          <ul class="mt-2">
                            <li>Add assets with multiple input fields.</li>
                            <li>Provide detailed asset information.</li>
                            <li>Enable precise categorization.</li>
                          </ul>
                        </div>
                      </li>
                      <li
                        :class="[
                          'asset-mode-chip is-disabled',
                          { selected: selectedMode === 'import' },
                        ]"
                        @click="selectMode('import')"
                      >
                        <div :class="['circle', { selected: selectedMode === 'import' }]">
                          <v-icon v-if="selectedMode === 'import'" icon="mdi-check" />
                        </div>
                        <div class="statement">
                          <p>Import</p>
                          <ul class="mt-2">
                            <li>Add assets via file upload.</li>
                            <li>Supports data extraction.</li>
                            <li>Automatically categorizes asset types.</li>
                          </ul>
                        </div>
                      </li>
                    </ul>

                    <!-- advanced -->

                    <ul
                      v-if="step === 2 && selectedMode === 'advanced'"
                      class="advanced-mode"
                    >
                      <li
                        class="mb-3"
                        :class="{ selected: selectedAsset === 'Domain' }"
                        @click="selectAsset('domain')"
                      >
                        <span>Domain</span>
                        <span>Main website address</span>
                      </li>
                      <li
                        class="mb-3"
                        :class="{ selected: selectedAsset === 'Subdomain' }"
                        @click="selectAsset('subdomain')"
                      >
                        <span>Subdomain</span>
                        <span>Secondary address under a main domain</span>
                      </li>
                      <li
                        class="mb-3"
                        :class="{ selected: selectedAsset === 'Url' }"
                        @click="selectAsset('url')"
                      >
                        <span>URL</span>
                        <span>Specific web link to a page or resource</span>
                      </li>
                      <li
                        class="mb-3"
                        :class="{ selected: selectedAsset === 'Ipv4' }"
                        @click="selectAsset('ipv4')"
                      >
                        <span>IPv4</span>
                        <span>Single Internet Protocol address</span>
                      </li>
                      <li
                        :class="{ selected: selectedAsset === 'Ipv4-range' }"
                        @click="selectAsset('ipv4-range')"
                      >
                        <span>IPv4 range</span>
                        <span>Block of IPv4 addresses</span>
                      </li>
                    </ul>

                    <!-- basic -->

                    <div
                      v-if="step === 2 && selectedMode === 'basic'"
                      class="basic-detail pt-1"
                      style="margin-top: 36px"
                    >
                      <div class="import-add-asset is-flex">
                        <span class="mb-1 v-label">Asset Group</span>
                        <v-btn
                          id="menu-activator"
                          variant="text"
                          border
                          :append-icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                          class="is-flex"
                          @click="toggleDropdown()"
                        >
                          <span>{{
                            selectedAssetGroup
                              ? selectedAssetGroup
                              : 'Choose a Asset group'
                          }}</span>
                          <v-menu activator="parent">
                            <v-list class="menu-list mt-1">
                              <v-list-item
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                              >
                                <div
                                  class="is-flex is-align-items-center content"
                                  @click="openCollectionModal = true"
                                >
                                  <img
                                    src="/images/icons/navbar/vuesax_linear_add.svg"
                                    alt="back"
                                  />
                                  <span>Create a new asset group</span>
                                </div>
                              </v-list-item>
                              <hr class="dropdown-divider" />
                              <v-list-item
                                v-for="(item, index) in collections"
                                :key="index"
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                                @click="setAsset(item)"
                              >
                                {{ item.name }}
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-btn>
                        <div class="add-asset-part mt-5">
                          <span class="mb-1 v-label">Assets</span>
                          <v-textarea
                            v-model="form.value"
                            class="content"
                            variant="outlined"
                            rows="5"
                            placeholder="Please enter the value of each asset, one per line."
                          ></v-textarea>
                          <HasError :form="form" field="value" />
                          <HasError :form="form" field="assets_limit" />
                        </div>

                        <v-btn
                          class="add-asset-btn"
                          style="margin-top: 57px"
                          @click="save"
                        >
                          <img
                            class="mr-1"
                            src="/images/icons/navbar/vuesax_linear_add.svg"
                            alt="add a asset"
                          />
                          <span class="">Add a Asset</span>
                        </v-btn>
                      </div>
                    </div>

                    <!-- import -->

                    <div
                      v-if="step === 2 && selectedMode === 'import'"
                      class="import-detail pt-1"
                    >
                      <div class="import-button-group is-flex">
                        <v-btn
                          class="assets v-label"
                          :class="{ selected: importedMode === 'assets' }"
                          @click="importMode('assets')"
                        >
                          <span>Import Assets</span>
                        </v-btn>
                        <v-btn
                          class="assets v-label"
                          :class="{ selected: importedMode === 'openapi' }"
                          @click="importMode('openapi')"
                        >
                          <span>Import OpenAPI</span>
                        </v-btn>
                        <v-btn
                          class="assets v-label"
                          :class="{ selected: importedMode === 'postman' }"
                          @click="importMode('postman')"
                        >
                          <span>Import Postman</span>
                        </v-btn>
                      </div>

                      <div class="import-statement mt-4">
                        <span v-if="importedMode === 'assets'" class="v-label">
                          Import your assets by downloading the sample Excel file, filling
                          in the required data, and uploading it back to the system.
                        </span>
                        <span v-if="importedMode === 'openapi'" class="v-label">
                          Import your assets by uploading a JSON or YAML OpenAPI Schema
                          file directly into the system.
                        </span>
                        <span v-if="importedMode === 'postman'" class="v-label">
                          Import your assets by uploading a JSON Postman collection file
                          directly into the system.
                        </span>
                      </div>

                      <div class="import-add-asset is-flex">
                        <span class="mt-5 mb-1 v-label">Asset Group</span>
                        <v-btn
                          id="menu-activator"
                          variant="text"
                          border
                          :append-icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                          class="is-flex"
                          @click="toggleDropdown()"
                        >
                          <span>{{
                            selectedAssetGroup
                              ? selectedAssetGroup
                              : 'Choose a Asset group'
                          }}</span>
                          <v-menu activator="parent">
                            <v-list class="menu-list mt-1">
                              <v-list-item
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                              >
                                <div
                                  class="is-flex is-align-items-center content"
                                  @click="openCollectionModal = true"
                                >
                                  <img
                                    src="/images/icons/navbar/vuesax_linear_add.svg"
                                    alt="back"
                                  />
                                  <span>Create a new asset group</span>
                                </div>
                              </v-list-item>
                              <hr class="dropdown-divider" />
                              <v-list-item
                                v-for="(item, index) in collections"
                                :key="index"
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                                @click="setAsset(item)"
                              >
                                {{ item.name }}
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-btn>

                        <div v-if="importedMode !== 'assets'">
                          <p
                            class="mb-1 mt-4 is-flex is-align-items-center is-justify-content-space-between v-label import-domain-asset-value"
                          >
                            <span>Domain Asset value</span>
                            <span>(It is not editable later)</span>
                          </p>
                          <VField>
                            <VControl>
                              <div class="domain-asset-value">
                                <VInput
                                  v-model="form.value"
                                  type="text"
                                  placeholder="Enter the Domain Asset value"
                                >
                                </VInput>
                                <HasError :form="form" field="value" />
                              </div>
                            </VControl>
                          </VField>
                        </div>

                        <ul
                          class="asset-mode is-flex is-align-items-center is-justify-content-center"
                        >
                          <li
                            v-if="importedMode === 'assets'"
                            class="asset-mode-chip is-justify-content-center"
                            :class="{ selected: selectedType === 'download' }"
                            @click="selectFile('download')"
                          >
                            <img :src="downloadSrc" alt="back" />
                            <p class="v-label">
                              First Download a sample file to view the format
                            </p>
                          </li>
                          <li
                            class="asset-mode-chip is-justify-content-center"
                            :class="{ selected: selectedType === 'upload' }"
                            @click="selectFile('upload')"
                          >
                            <img :src="uploadSrc" alt="back" />
                            <p class="v-label">Upload your data file to add assets</p>
                          </li>
                        </ul>

                        <v-btn
                          class="add-asset-btn"
                          :style="
                            importedMode === 'assets'
                              ? { marginTop: '98px' }
                              : { marginTop: '20px' }
                          "
                          @click="save"
                        >
                          <img
                            class="mr-1"
                            src="/images/icons/navbar/vuesax_linear_add.svg"
                            alt="add a asset"
                          />
                          <span class="">Add a Asset</span>
                        </v-btn>
                      </div>
                    </div>

                    <!-- step = 3 -->

                    <ul v-if="step === 3" class="subdomain-detail">
                      <li v-if="!editable" class="mb-5">
                        <p class="mb-1">Asset Group</p>
                        <v-btn
                          id="menu-activator"
                          class="select-project2"
                          variant="text"
                          border
                          :append-icon="
                            assetGroupOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'
                          "
                          @click="assetGroupDropdown()"
                        >
                          <span>{{
                            selectedAssetGroup
                              ? selectedAssetGroup
                              : 'Choose a Asset group'
                          }}</span>
                          <v-menu activator="parent">
                            <v-list class="menu-list mt-1">
                              <v-list-item
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                                @click="openCollectionModal = true"
                              >
                                <div class="is-flex is-align-items-center content">
                                  <img
                                    src="/images/icons/navbar/vuesax_linear_add.svg"
                                    alt="back"
                                  />
                                  <span>Create a new asset group</span>
                                </div>
                              </v-list-item>
                              <hr class="dropdown-divider" />
                              <v-list-item
                                v-for="(item, index) in collections"
                                :key="index"
                                class="dropdown-block sub-item"
                                role="button"
                                tabindex="0"
                                @click="setAsset(item)"
                              >
                                {{ item.name }}
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-btn>
                      </li>
                      <li class="mb-5">
                        <p
                          class="mb-1 is-flex is-align-items-center is-justify-content-space-between"
                        >
                          <span>{{ selectedAsset }} Asset value</span>
                          <span>(It is not editable later)</span>
                        </p>
                        <VField>
                          <VControl>
                            <div
                              v-if="
                                selectedAsset === 'Domain' ||
                                selectedAsset === 'Subdomain'
                              "
                              class="domain-asset-value"
                            >
                              <VInput
                                v-model="form.value"
                                type="text"
                                :placeholder="`Enter the ${selectedAsset} Asset value`"
                              >
                              </VInput>
                              <HasError :form="form" field="value" />
                            </div>

                            <div v-else-if="selectedAsset === 'Url'" class="columns">
                              <div class="column is-4 is-flex">
                                <v-btn
                                  id="menu-activator"
                                  class="select-domain is-flex is-justify-content-space-between"
                                  variant="text"
                                  border
                                  :append-icon="
                                    urlOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'
                                  "
                                  @click="urlDropdown()"
                                >
                                  <span>{{ urlMode }}</span>
                                  <v-menu activator="parent">
                                    <v-list class="menu-list mt-1">
                                      <v-list-item
                                        :key="index"
                                        class="dropdown-block sub-item"
                                        role="button"
                                        tabindex="0"
                                        @click="urlMode = 'https://'"
                                      >
                                        https://
                                      </v-list-item>
                                      <v-list-item
                                        :key="index"
                                        class="dropdown-block sub-item"
                                        role="button"
                                        tabindex="0"
                                        @click="urlMode = 'http://'"
                                      >
                                        http://
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </v-btn>
                              </div>
                              <div class="column is-8 domain-asset-value">
                                <VInput
                                  v-model="url"
                                  type="text"
                                  :placeholder="`Enter the ${selectedAsset} Asset value`"
                                  @input="urlChange"
                                >
                                </VInput>
                                <HasError :form="form" field="value" />
                              </div>
                            </div>

                            <div v-else class="columns">
                              <div class="column is-4 is-flex">
                                <v-checkbox
                                  v-model="form.private_network"
                                  label="Private network IP"
                                ></v-checkbox>
                                <HasError :form="form" field="private_network" />
                              </div>
                              <div class="column is-8 domain-asset-value">
                                <VInput
                                  v-model="form.value"
                                  type="text"
                                  :placeholder="`Enter the ${selectedAsset} Asset value`"
                                >
                                </VInput>
                                <HasError :form="form" field="value" />
                              </div>
                            </div>
                          </VControl>
                        </VField>
                      </li>
                      <li class="is-flex is-justify-content-space-between">
                        <div style="flex: 1">
                          <p class="mb-1">Business Impact</p>
                          <v-btn
                            id="menu-activator"
                            class="select-project2"
                            variant="text"
                            border
                            :append-icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                            @click="toggleDropdown()"
                          >
                            <span>{{
                              form.business_impact
                                ? form.business_impact
                                : 'Select Business Impact'
                            }}</span>
                            <v-menu activator="parent">
                              <v-list class="menu-list mt-1">
                                <v-list-item
                                  v-for="(item, index) in general.assets.impacts"
                                  :key="index"
                                  class="dropdown-block sub-item"
                                  role="button"
                                  tabindex="0"
                                  @click="form.business_impact = item"
                                >
                                  {{ item }}
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-btn>
                        </div>
                        <div style="flex: 1">
                          <p class="mb-1">Tags</p>
                          <VField>
                            <VControl>
                              <div
                                class="is-flex is-justify-content-space-between is-align-items-center domain-asset-value"
                              >
                                <Vue3TagsInput
                                  :tags="form.tags"
                                  placeholder="Enter tags"
                                  @on-tags-changed="handleChangeTag"
                                />
                                <HasError :form="form" field="tags" />
                              </div>
                            </VControl>
                          </VField>
                        </div>
                      </li>
                    </ul>

                    <v-btn
                      v-if="step === 3"
                      class="add-asset-btn"
                      :readonly="isSaving"
                      @click="save"
                    >
                      <img
                        v-if="!editable"
                        class="mr-1"
                        src="/images/icons/navbar/vuesax_linear_add.svg"
                        alt="add a asset"
                      />
                      <span class="">{{ editable ? 'Edit Asset' : 'Add a Asset' }}</span>
                    </v-btn>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="add-success">
          <div class="main-body is-flex is-justify-content-center">
            <img
              class="add-asset-success"
              src="/images/icons/navbar/vuesax-bold-shield-tick.svg"
              alt="add-success"
            />
            <div v-if="editable" class="success-statement pt-2">
              <span class="v-label mb-5">Asset Modified Successfully!</span>
              <span class="v-label">You've successfully modified the asset.</span>
            </div>
            <div v-else class="success-statement pt-2">
              <span class="v-label mb-5">Asset Added Successfully!</span>
              <span class="v-label"
                >You've successfully added the asset to your asset list.</span
              >
            </div>
            <div class="success-button-group is-flex">
              <v-btn v-if="!editable" class="add-asset-btn" @click="addAnotherAsset">
                <img
                  class="mr-1"
                  src="/images/icons/navbar/vuesax_linear_add.svg"
                  alt="add another asset"
                />
                <span class="">Add another Asset</span>
              </v-btn>
              <v-btn class="view-asset-btn" @click="goToAsset(addedItem)">
                <img
                  class="mr-1"
                  src="/images/icons/navbar/vuesax-linear-eye.svg"
                  alt="view asset"
                />
                <span class="v-label">View asset</span>
              </v-btn>
            </div>
            <p
              v-if="!editable && assetsLimit === assetsCount && assetsLimit !== 0"
              class="v-label contact-support is-justify-content-center"
            >
              You've reached your asset limit. To increase it, please
              <span class="ml-1">Contact support</span>
            </p>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <div v-if="openCollectionModal">
      <CollectionsModal :project="project" @closeModal="closeCollectionModal" />
    </div>
  </div>
</template>
<script>
import VProgress from '/@src/components/base/progress/VProgress.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import { mapGetters } from 'vuex'
import Form from '/@src/form'
import { defineAsyncComponent } from 'vue'
import { HasError } from 'vform/src/components/bootstrap5'
import { axios } from '/@src/axios'
import urlMixin from '/@src/mixins/urlMixin'
import Vue3TagsInput from 'vue3-tags-input'

export default {
  components: {
    VProgress,
    VInput,
    VField,
    VControl,
    CollectionsModal: defineAsyncComponent(
      () => import('/@src/components/collections/NewCollectionsModal.vue')
    ),
    HasError,
    Vue3TagsInput,
  },
  mixins: [urlMixin],
  props: ['editable', 'project', 'collection'],
  emits: ['closeModal'],
  data: () => ({
    dialog: '',
    selectedMode: '',
    selectedType: '',
    importedMode: 'assets',
    selectedAsset: '',
    open: true,
    urlOpen: true,
    assetGroupOpen: true,
    step: 1,
    domainAsset: '',
    form: new Form({}),
    addStatus: false,
    openCollectionModal: false,
    selectedAssetGroup: '',
    addedItem: {},
    urlMode: 'https://',
    url: '',
    assetsCount: 0,
    assetsLimit: 0,
    isSaving: false,
  }),
  computed: {
    ...mapGetters(['general', 'projectAssets', 'workspace', 'general']),
    backgroundColor() {
      return this.addStatus ? 'var(--dark-body-color)' : 'var(--dark-hover-color)'
    },
    downloadSrc() {
      if (this.selectedType === 'download') {
        return '/images/icons/navbar/vuesax-bold-document-download.svg'
      } else {
        return '/images/icons/navbar/vuesax-linear-document-download.svg'
      }
    },
    uploadSrc() {
      if (this.selectedType === 'upload') {
        return '/images/icons/navbar/vuesax-bold-document-upload.svg'
      } else {
        return '/images/icons/navbar/vuesax-linear-document-upload.svg'
      }
    },
  },
  mounted() {
    this.assetsCount = this.workspace.assets_count
    this.assetsLimit = this.workspace.activeLicense.asset_limit

    if (this.editable) {
      this.selectedMode = 'advanced'
      this.selectedAsset =
        this.editable.type.charAt(0).toUpperCase() + this.editable.type.slice(1)
      this.step = 3

      this.form.name = this.editable.name
      this.form.status = this.editable.status
      this.form.type = this.editable.type
      this.form.priority = this.editable.priority
      this.form.business_impact = this.editable.business_impact
      this.form.tags = this.editable.tags
      this.form.value = this.editable.value
      this.form.private_network = this.editable.private_network
    } else {
      this.form.project_id = this.project?.id
      this.form.tags = []
      this.form.value = ''
      this.form.multiple = true
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'
      this.form.priority = 'normal'
      this.form.type = Object.keys(this.general.assets.types)[0]
    }
    if (!this.collection) {
      this.getCollections()
    } else {
      this.form.collection_id = this.collection.id
    }
  },
  methods: {
    urlChange() {
      if (this.url) {
        this.form.value = this.urlMode + this.url
      } else {
        this.form.value = ''
      }
    },
    goToAsset(item) {
      this.$emit('closeModal', item)
    },
    save() {
      if (this.isSaving) {
        return
      }
      this.isSaving = true
      this.send()
        .then(() => {})
        .catch(() => {})
    },
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/asset/' + this.editable.id + '?_method=PUT')
      } else {
        this.addedItem = this.form
        if (this.form.multiple) {
          form = this.form.post('/asset/multiple')
        } else {
          form = this.form.post('/asset')
        }
      }
      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            setTimeout(() => {
              this.addStatus = true
              this.isSaving = false
            }, 500)
            this.selectedMode === 'advanced' ? (this.step = 4) : (this.step = 3)
            this.selectedMode === 'basic'
              ? (this.form.multiple = true)
              : (this.form.multiple = false)
            const { data } = res.data
            resolve(data)
          })
          .catch((err) => {
            this.isSaving = false
            if (err.response.data.message) {
              this.$store.dispatch('addAlert', {
                text: err.response.data.message,
                type: 'danger',
              })
            } else {
              this.$store.dispatch('addAlert', {
                text: 'An error occurred. Please try again later',
                type: 'danger',
              })
            }
            reject()
          })
      })
    },
    handleChangeTag(tags) {
      this.form.tags = tags
    },
    addAnotherAsset() {
      if (this.editable) {
        return
      }
      this.addStatus = false
      this.step = 1
      this.selectedMode = ''
    },
    selectFile(selectType) {
      this.selectedType = selectType
    },
    importMode(mode) {
      this.importedMode = mode
      this.selectedType = ''
    },
    selectMode(mode) {
      if (this.editable) {
        this.selectedAsset =
          this.editable.type.charAt(0).toUpperCase() + this.editable.type.slice(1)
      } else {
        this.selectedAsset = ''
      }
      this.form.multiple = mode === 'basic' ? true : false
      this.selectedType = ''
      this.importedMode = 'assets'
      this.selectedMode = mode
      setTimeout(() => {
        this.step = 2
      }, 200)
    },
    selectAsset(asset) {
      if (this.editable) {
        return
      }
      this.form.value = ''
      this.selectedAsset = asset.charAt(0).toUpperCase() + asset.slice(1)
      this.form.type = asset
      setTimeout(() => {
        this.step = 3
      }, 200)
    },
    toggleDropdown() {
      this.open = !this.open
      this.urlOpen = true
      this.assetGroupOpen = true
    },
    urlDropdown() {
      this.urlOpen = !this.urlOpen
      this.open = true
      this.assetGroupOpen = true
    },
    assetGroupDropdown() {
      this.assetGroupOpen = !this.assetGroupOpen
      this.urlOpen = true
      this.open = true
    },
    stepBack() {
      if (this.editable) {
        return
      }

      this.step > 1 ? this.step-- : ''
    },
    closeCollectionModal() {
      this.openCollectionModal = false
      this.getCollections()
    },
    getCollections() {
      if (!this.project) {
        return
      }

      axios
        .get(`/collection`, {
          params: {
            id: this.project.id,
            status: 'active',
          },
        })
        .then((res) => {
          this.collections = res.data.data
          if (!this.editable) {
            this.setAsset(this.collections[0])
          }
        })
        .catch(() => {})
    },
    setAsset(item) {
      this.form.collection_id = item.id
      this.selectedAssetGroup = item.name
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.5s ease;
}
.fade-slow-enter,
.fade-slow-leave-to {
  opacity: 0;
}

.add-asset-modal {
  .v-card {
    height: 600px;

    .modal-header {
      height: 56px;

      div {
        height: 100%;

        &:first-child {
          padding: 20px 22px 0;
          background: var(--dark-hover-color);

          .add-asset {
            font-family: Poppins;
            font-size: 18px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            text-align: left;
            color: #e1e1ef;
            margin-left: 6px;
          }
        }

        &:last-child {
          padding: 20px 16px 8px;
          background: var(--dark-body-color);
          img {
            float: right;
          }
        }

        img {
          cursor: pointer;
        }
      }
    }

    .modal-left {
      background: var(--dark-hover-color);
      padding: 37px 28px 20px;
      flex-direction: column;
      justify-content: space-between;
      min-height: 547px;

      img {
        cursor: pointer;
      }

      .add-asset-description {
        font-family: Poppins;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #e1e1ef;
      }

      .total-asset {
        margin-left: 3.5px;
        margin-bottom: 26px;

        span {
          font-family: Poppins;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: left;
          color: #e1e1ef;

          &:last-child {
            flex-grow: 0;
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: left;
            color: var(--dark-table-sm-text-color);
          }
        }
      }

      .select-mode-sidebar {
        li {
          flex-grow: 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 10px;
          padding: 16px;
          border-radius: 8px;
          height: 54px;
          cursor: pointer;

          &:hover {
            background: var(--dark-body-color);
          }

          p {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: #e1e1ef;
          }
        }

        li.selected {
          flex-grow: 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 10px;
          padding: 16px;
          border-radius: 8px;
          background-color: var(--dark-primary);
        }
      }
    }

    .modal-body {
      padding: 0 0 26.2px;
      background: var(--dark-body-color);

      .close-modal {
        padding: 0 22.2px;
        height: 36px;

        img {
          cursor: pointer;
          float: right;
        }
      }
      .select-mode {
        margin: 0 56px;

        .wizard-progress {
          height: 0.25rem !important;
          top: 0;
        }

        .line {
          width: 160px;
          height: 2px;
          flex-grow: 0;
          background-color: var(--dark-table-sm-text-color);
          margin: 0 20.7px;

          &:first-child {
            margin-left: 0px;
          }
          &:last-child {
            margin-right: 0px;
          }
        }
        .select-body {
          margin-top: 28px;

          .select-description,
          .select-asset-type-description,
          .asset-detail {
            animation: fadeInLeft 0.5s;
            p {
              &:first-child {
                flex-grow: 0;
                font-family: Poppins;
                font-size: 18px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.33;
                letter-spacing: normal;
                text-align: left;
                color: #e1e1ef;
              }

              &:last-child {
                margin-top: 8px;
                font-family: Poppins;
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.5;
                letter-spacing: normal;
                text-align: left;
                color: #e1e1ef;
              }
            }
          }

          .asset-mode {
            margin-top: 56px;

            .asset-mode-chip {
              margin: 0 5.6px;
              width: 180px;
              height: 240px;
              border: solid 1.6px var(--dark-border-color);
              display: flex;
              flex-direction: column;
              align-items: center;
              border-radius: 8px;

              &:hover {
                cursor: pointer;
                background: var(--dark-hover-color);
              }

              .circle {
                margin-top: 32px;
                margin-bottom: 16px;
                width: 20px;
                height: 20px;
                flex-grow: 0;
                border-radius: 100px;
                border: solid 1.6px var(--dark-table-sm-text-color);
                display: flex;
                align-items: center;
                justify-content: center;

                i {
                  scale: 0.95;
                  color: var(--dark-primary);
                  font-size: 25px;
                }
              }

              .circle.selected {
                background: white;
              }

              .statement {
                display: flex;
                flex-direction: column;
                align-items: center;

                p {
                  font-family: Poppins;
                  font-size: 20px;
                  font-weight: 600;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.2;
                  letter-spacing: normal;
                  text-align: center;
                  color: #e1e1ef;
                }

                ul {
                  padding: 0 8px 0 26px;

                  li {
                    margin-bottom: 4px;
                    list-style-type: disc;
                    font-family: Poppins;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;
                    color: #e1e1ef;
                  }
                }
              }
            }

            .asset-mode-chip.selected {
              background: var(--dark-primary);
            }
          }

          .advanced-mode {
            margin-top: 36px;

            li {
              width: 480px;
              height: 58px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 42px;
              padding: 20px 32px;
              border-radius: 8px;
              border: solid 1.6px var(--dark-border-color);

              &:hover {
                background: var(--dark-hover-color);
                cursor: pointer;
                transition: all 0.3s;
                border: solid 1px #434656;
              }

              span {
                &:first-child {
                  width: 84px;
                  flex-grow: 0;
                  font-family: Poppins;
                  font-size: 14px;
                  font-weight: 600;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.2;
                  letter-spacing: normal;
                  text-align: center;
                  color: #e1e1ef;
                }

                &:last-child {
                  flex-grow: 1;
                  font-family: Poppins;
                  font-size: 12px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  text-align: left;
                  color: #e1e1ef;
                }
              }
            }

            li.selected {
              background: var(--dark-primary);
              border: var(--dark-primary);
            }
          }

          .subdomain-detail {
            margin-top: 36px;

            p {
              font-family: Poppins;
              font-size: 14px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              text-align: left;
              color: #e1e1ef;
            }

            .select-project2 {
              border-radius: 4px !important;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.13;
              letter-spacing: normal;
              text-align: left;
              color: var(--dark-table-sm-text-color);
              text-transform: none;
              height: 40px;
              display: flex;
              justify-content: space-between;
              width: 100%;
              padding: 0 12px !important;

              i {
                margin-left: 8px;
              }
            }

            li {
              &:last-child {
                gap: 12px;
              }
              &:nth-child(2) {
                span {
                  &:last-child {
                    font-family: Poppins;
                    font-size: 12px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;
                    color: var(--dark-table-sm-text-color);
                  }
                }
              }

              .domain-asset-value {
                input {
                  padding: 11px 12px !important;
                  height: 40px;
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.13;
                  letter-spacing: normal;
                  text-align: left;
                  color: var(--dark-table-sm-text-color);

                  &::placeholder {
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.13;
                    letter-spacing: normal;
                    text-align: left;
                    color: var(--dark-table-sm-text-color) !important;
                  }
                  &:focus-visible {
                    outline: none;
                  }
                }

                .v3ti {
                  background: var(--dark-body-color) !important;
                  outline: none !important;

                  .v3ti-tag {
                    background: var(--dark-hover-color) !important;
                  }

                  input {
                    &:focus-visible {
                      outline: none;
                    }
                  }
                }
              }

              .columns {
                .select-domain {
                  width: 100%;
                  height: 40px;

                  span {
                    font-size: 14px !important;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.13;
                    letter-spacing: normal;
                    text-align: left;
                    color: var(--dark-table-sm-text-color);
                    text-transform: capitalize;
                  }
                }
              }
            }
          }

          .import-detail,
          .basic-detail {
            .import-button-group {
              button {
                flex: 1 1 0;
                height: 40px;
                border-radius: 8px;
                text-transform: capitalize;
                letter-spacing: 0.1px;
                text-align: center;
                color: var(--dark-table-text-color);
              }
              button.selected {
                background: var(--sidebar-color) !important;
              }
            }
            .import-statement {
              .v-label {
                white-space: normal;
                font-size: 16px;
                line-height: 1.5;
                letter-spacing: normal;
              }
            }

            .import-add-asset {
              flex-direction: column;

              .v-label {
                font-weight: 500;
                line-height: 1.5;
                letter-spacing: 0;
              }

              .v-btn {
                height: 40px;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                border-radius: 4px;
                border: solid 1px var(--dark-border-color);
                text-transform: none;

                span {
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.13;
                  letter-spacing: normal;
                  text-align: left;
                  color: var(--dark-table-sm-text-color);
                }
              }
              .asset-mode {
                margin-top: 20px;
                gap: 17px;

                li {
                  flex-grow: 1;
                  margin: 0;
                  height: 108px;

                  p {
                    line-height: 1.5;
                    letter-spacing: 0;
                    white-space: normal;
                    padding: 8px 36px;
                    text-align: center;
                  }

                  &:last-child {
                    p {
                      padding: 8px 54px;
                    }
                  }
                }

                li.selected {
                  background: var(--dark-primary);
                  border: var(--dark-primary);
                }
              }

              .add-asset-btn {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 0 16px 0 12px;
                border-radius: 100px;
                background: var(--dark-primary) !important;
                text-transform: capitalize;
                border: none;

                span {
                  font-weight: 500;
                  letter-spacing: 0.13px;
                  color: #fff;
                  font-size: 14px;
                }
              }
              .import-domain-asset-value {
                font-weight: 500;
                letter-spacing: normal;

                span {
                  &:last-child {
                    font-size: 12px;
                    line-height: 1.5;
                    color: var(--dark-table-sm-text-color);
                  }
                }
              }
              .domain-asset-value {
                input {
                  padding: 11px 12px !important;
                  height: 40px;
                  border: solid 1px var(--dark-border-color);

                  &::placeholder {
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.13;
                    letter-spacing: normal;
                    text-align: left;
                    color: var(--dark-table-text-color) !important;
                  }
                  &:focus-visible {
                    outline: none;
                  }
                }
              }

              .add-asset-part {
                .content {
                  textarea {
                    padding: 1px !important ;
                    &::placeholder {
                      color: red !important;
                    }
                  }
                }
              }
            }
          }
          .add-asset-btn {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0 16px 0 12px;
            border-radius: 100px;
            background: var(--dark-primary) !important;
            text-transform: capitalize;
            margin-top: 64px;
            border: none;

            span {
              font-weight: 500;
              letter-spacing: 0.13px;
              color: #fff;
              font-size: 14px;
            }
          }
        }
      }
    }

    .add-success {
      height: 100%;
      background: var(--dark-body-color);

      .main-body {
        padding: 144px 132px;
        flex-direction: column;

        .add-asset-success {
          padding: 20px;
          height: 120px;
        }

        .success-statement {
          text-align: center;

          span {
            &:first-child {
              font-size: 24px;
              font-weight: 600;
              line-height: 1.2;
              text-align: center;
            }

            &:last-child {
              font-size: 18px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
            }
          }
        }

        .success-button-group {
          margin-top: 72px;
          gap: 12px;

          .add-asset-btn {
            flex: 1 1 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0 16px 0 12px;
            border-radius: 100px;
            background: var(--dark-primary) !important;
            text-transform: capitalize;
            border: none;
            color: #fff;

            span {
              color: #fff;
              letter-spacing: 0.13px;
              font-weight: 500;
              font-size: 14px;
            }
          }

          .view-asset-btn {
            flex: 1 1 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0 16px 0 12px;
            border-radius: 100px;
            text-transform: capitalize;
            border: none;
            color: #fff;
            border: solid 1px var(--dark-border-color);

            span {
              color: #fff;
              letter-spacing: 0.13px;
              font-weight: 500;
            }
          }
        }
        .contact-support {
          margin-top: 40px;
          font-size: 16px;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: center;

          span {
            color: #0143da;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.menu-list {
  background: var(--sidebar-color) !important;

  .dropdown-block {
    min-height: 40px !important;
    padding: 8px 12px !important;

    &:hover {
      background: var(--dark-hover-color) !important;
    }
  }

  .dropdown-divider {
    background: #434656;
  }
  .sub-item {
    display: flex !important;
    font-family: Poppins;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: 0.25px;
    text-align: left;
    color: #e1e1ef;

    .content {
      line-height: 0;
      gap: 12px;
    }
  }
  .logout {
    button {
      background: var(--dark-primary) !important;
      width: 140px;
      letter-spacing: 1px !important;
      font-size: 14px;
    }
  }
}
</style>