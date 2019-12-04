<template>
  <span>
    <v-app-bar app clipped-left>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://hotemoji.com/images/dl/o/skull-emoji-by-google.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <v-toolbar-title>skelevision</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/skelevision/skelevision" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <section class="upload">
        <div id="upload-form">
          <form ref="fileform" v-if="!(file)">
            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
            <span class="drop-files">Drag & Drop or Click here to upload your log file!</span>
          </form>

          <div class="upload-controls" v-else>
            <div class="file-listing">              <!-- <img class="preview" ref="preview" /> -->
              <p v-if="file">{{ file.name }}</p>
              <div class="remove-container">
                <a class="remove" v-on:click="removeFile()">X</a>
              </div>
            </div>

            <v-progress-linear :value="uploadPercentage"></v-progress-linear>
            <!-- <progress max="100" :value.prop="uploadPercentage"></progress> -->

            <button class="submit-button" v-on:click="submitFile()">Submit</button>
          </div>
        </div>
      </section>
    </v-content>
  </span>
</template>

<script>
import { HTTP } from "../http-common";

export default {
  name: "home",
  data: () => ({
    dragAndDropCapable: false,
    file: null,
    uploadPercentage: 0
  }),
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    if (this.dragAndDropCapable) {
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop"
      ].forEach(
        function(evt) {
          this.$refs.fileform.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
            }.bind(this),
            false
          );
        }.bind(this)
      );

      this.$refs.fileform.addEventListener(
        "drop",
        function(e) {
          this.file = e.dataTransfer.files[0];
        }.bind(this)
      );
    }
  },

  methods: {
    determineDragAndDropCapable() {
      var div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },

    getImagePreviews() {
      for (let i = 0; i < this.files.length; i++) {
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          let reader = new FileReader();

          reader.addEventListener(
            "load",
            function() {
              this.$refs["preview" + parseInt(i)][0].src = reader.result;
            }.bind(this),
            false
          );

          reader.readAsDataURL(this.files[i]);
        } else {
          this.$nextTick(function() {
            this.$refs["preview" + parseInt(i)][0].src = "/images/file.png";
          });
        }
      }
    },
    removeFile(key) {
      this.file = null;
    },
    submitFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      HTTP.post("upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: function(progressEvent) {
          this.uploadPercentage = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }.bind(this)
      })
        .then(response => {
          this.$router.push("process");
        })
        .catch(() => {
          console.log("FAILURE!!");
        });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    }
  },
  components: {}
};
</script>

<style lang="sass" scoped>
section.upload
  width: 100%
  padding: 150px 0


#upload-form
  width: 800px
  margin-left: auto
  margin-right: auto
  height: 300px
  position: relative
  border-radius: 40px
  border: 4px #ffffff dotted
  padding: 10px 30px

form
  display: block
  text-align: center
  line-height: 400px
  position: relative

#file
  position: absolute
  margin: 0
  padding: 0
  width: 100%
  height: 100%
  outline: none
  opacity: 0
  cursor: pointer

div
  &.file-listing
    width: 400px
    margin: auto
    padding: 10px

    img
      height: 100px

  &.remove-container
    text-align: center

    a
      color: red
      cursor: pointer

.file-listing
  display: flex
  flex-direction: row
  justify-content: space-between

button.submit-button
  display: block
  margin: auto
  text-align: center
  width: 200px
  padding: 10px
  text-transform: uppercase
  background-color: #CCC
  color: white
  font-weight: bold
  margin-top: 20px

progress
  width: 400px
  margin: auto
  display: block
  margin-top: 20px
  margin-bottom: 20px
</style>