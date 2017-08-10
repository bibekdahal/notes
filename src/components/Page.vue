<template>
    <div class="page">
        <note
            v-for="note in notes"
            v-bind:note="note"
        />
    </div>
</template>

<script>
import Note from './Note';

export default {
    name: 'page',
    components: {
        Note,
    },
    data() {
        return {
            notes: [
                {
                    title: 'Title',
                    content: '<b>Hello</b>',
                    position: { x: 50, y: 100 },
                },
                {
                    title: 'Yet another title',
                    content: '<i>World</i>',
                    position: { x: 100, y: 200 },
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.page {
    position: relative;
}
</style>
