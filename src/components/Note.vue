<template>
    <div class="note" v-bind:style="noteStyle">
        <div class="title">{{ note.title }}</div>
        <div class="content" v-html="note.content"></div>
    </div>
</template>

<script>
export default {
    name: 'note',
    data() {
        return {
            noteStyle: {
                left: `${this.note.position.x}px`,
                top: `${this.note.position.y}px`,
            },
        };
    },
    props: [
        'note',
    ],
};
</script>

<style lang="scss" scoped>
.note {
    position: absolute;
}
</style>
